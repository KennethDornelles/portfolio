import { Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { IRefreshTokenRepository } from './repositories/refresh-token.repository.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const tokens = await this.generateTokens(user.id, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
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
    await this.refreshTokenRepository.updateMany(
      { 
        userId, 
        revokedAt: null 
      },
      { revokedAt: new Date() },
    );
  }

  async refreshTokens(userId: string, rt: string) {
    const tokenRecord = await this.refreshTokenRepository.findUnique(rt);

    if (!tokenRecord) throw new ForbiddenException('Access Denied');

    // Reuse Detection
    if (tokenRecord.revokedAt) {
        // Security Risk: Revoke ALL tokens for this family/user
        await this.refreshTokenRepository.updateMany(
            { userId },
            { revokedAt: new Date() }
        );
        throw new ForbiddenException('Reuse detected. Account protected.');
    }

    if (tokenRecord.expiresAt < new Date()) {
        throw new ForbiddenException('Token expired');
    }

    // Token Rotation: consuming the old one
    const tokens = await this.generateTokens(userId, tokenRecord.userId); // userId fallback logic if needed
    
    await this.refreshTokenRepository.rotate(tokenRecord.id, {
      token: tokens.refreshToken,
      userId: userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return tokens;
  }

  private async generateTokens(userId: string, role?: string) {
    const iat = Math.floor(Date.now() / 1000) - 300; // 5 minutes in the past to avoid future iat rejection
    const payload = { sub: userId, role, iat };
    const secret = this.configService.get<string>('JWT_SECRET') || 'secret';
    
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }

  // Helper to persist/update RT (used in login)
  private async updateRefreshToken(userId: string, rt: string) {
    await this.refreshTokenRepository.create({
      token: rt,
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  }

  async loginAsGuest() {
    // Generate a random guest ID (simulated, not stored in DB to avoid clutter, or could be a fixed Guest User)
    // If we want audit logs to work for guest, we might need a real user.
    // But for "Demo Mode", read-only, maybe just a token is enough.
    // The UUID must be valid for database constraints if we use it in relations?
    // Refresh Tokens constrain on UserId. But we aren't creating a Refresh Token.
    // So any UUID is fine.
    const guestId = '00000000-0000-0000-0000-000000000000'; // Fixed Guest ID or random
    
    const payload = { sub: guestId, role: 'GUEST' };
    
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '15m',
    });

    return {
      accessToken,
      user: {
        id: guestId,
        email: 'guest@demo.com',
        role: 'GUEST',
        name: 'Demo Guest'
      }
    };
  }
}
