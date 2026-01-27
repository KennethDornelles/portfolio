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
    return tokens;
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
    const payload = { sub: userId, role };
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken: at,
      refreshToken: rt, // Note: We might want an opaque token for DB, but JWT is fine too.
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
}
