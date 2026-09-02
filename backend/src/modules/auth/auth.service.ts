import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { UsersService } from '../users/users.service';
import { JwtPayload, RefreshJwtPayload } from './auth.types';
import { IRefreshTokenRepository } from './repositories/refresh-token.repository.interface';

type TokenDuration = `${number}${'s' | 'm' | 'h' | 'd'}`;
type AuthenticatedUser = Omit<User, 'passwordHash'>;
type LoginUser = Pick<User, 'id' | 'email' | 'role'> & { name?: string | null };

const DURATION_MULTIPLIERS = {
  s: 1_000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
} as const;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthenticatedUser | null> {
    const user = await this.usersService.findByEmail(
      email.trim().toLowerCase(),
    );
    if (
      !user ||
      !user.isActive ||
      user.deletedAt ||
      !(await bcrypt.compare(password, user.passwordHash))
    ) {
      return null;
    }

    const { passwordHash: _passwordHash, ...authenticatedUser } = user;
    void _passwordHash;
    return authenticatedUser;
  }

  async login(user: LoginUser) {
    const now = new Date();
    const tokens = await this.generateTokens(user.id, user.role, now);
    await this.createRefreshToken(user.id, tokens.refreshToken, now);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || user.email.split('@')[0],
        role: user.role,
      },
    };
  }

  async logout(userId: string) {
    await this.revokeActiveTokens(userId, new Date());
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const now = new Date();
    const tokenRecord =
      await this.refreshTokenRepository.findUnique(refreshToken);

    if (!tokenRecord || tokenRecord.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (tokenRecord.revokedAt) {
      // There is no token-family column in the current schema, so reuse
      // invalidates every active refresh session owned by this user.
      await this.revokeActiveTokens(tokenRecord.userId, now);
      throw new ForbiddenException('Access denied');
    }

    if (tokenRecord.expiresAt <= now) {
      throw new ForbiddenException('Access denied');
    }

    const user = await this.usersService.findById(tokenRecord.userId);
    if (!user || !user.isActive || user.deletedAt) {
      await this.revokeActiveTokens(tokenRecord.userId, now);
      throw new ForbiddenException('Access denied');
    }

    const tokens = await this.generateTokens(user.id, user.role, now);
    const rotated = await this.refreshTokenRepository.rotate(
      tokenRecord.id,
      {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: this.getRefreshTokenExpiration(now),
      },
      now,
    );

    if (!rotated) {
      // Losing the conditional update means this token was consumed by a
      // concurrent request and is therefore treated as reuse.
      await this.revokeActiveTokens(user.id, now);
      throw new ForbiddenException('Access denied');
    }

    return tokens;
  }

  async loginAsGuest() {
    const guestId = '00000000-0000-0000-0000-000000000000';
    const now = new Date();
    const payload: JwtPayload = {
      sub: guestId,
      role: UserRole.GUEST,
      iat: Math.floor(now.getTime() / 1_000),
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      expiresIn: this.getDuration('JWT_EXPIRATION', '15m'),
    });

    return {
      accessToken,
      user: {
        id: guestId,
        email: 'guest@demo.com',
        role: UserRole.GUEST,
        name: 'Demo Guest',
      },
    };
  }

  private async generateTokens(userId: string, role: UserRole, now: Date) {
    const payload: JwtPayload = {
      sub: userId,
      role,
      iat: Math.floor(now.getTime() / 1_000),
    };
    const refreshPayload: RefreshJwtPayload = {
      ...payload,
      jti: randomUUID(),
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
        expiresIn: this.getDuration('JWT_EXPIRATION', '15m'),
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.getDuration('JWT_REFRESH_EXPIRATION', '7d'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async createRefreshToken(
    userId: string,
    refreshToken: string,
    now: Date,
  ) {
    await this.refreshTokenRepository.create({
      token: refreshToken,
      userId,
      expiresAt: this.getRefreshTokenExpiration(now),
    });
  }

  private async revokeActiveTokens(userId: string, now: Date) {
    await this.refreshTokenRepository.updateMany(
      { userId, revokedAt: null },
      { revokedAt: now },
    );
  }

  private getRefreshTokenExpiration(now: Date): Date {
    const duration = this.getDuration('JWT_REFRESH_EXPIRATION', '7d');
    return new Date(now.getTime() + this.durationToMilliseconds(duration));
  }

  private getDuration(name: string, fallback: TokenDuration): TokenDuration {
    const duration = this.configService.get<string>(name, fallback);
    if (!/^[1-9]\d*[smhd]$/.test(duration)) {
      throw new Error(`${name} must be a positive duration using s, m, h or d`);
    }

    return duration as TokenDuration;
  }

  private durationToMilliseconds(duration: TokenDuration): number {
    const unit = duration.at(-1) as keyof typeof DURATION_MULTIPLIERS;
    const amount = Number(duration.slice(0, -1));
    return amount * DURATION_MULTIPLIERS[unit];
  }
}
