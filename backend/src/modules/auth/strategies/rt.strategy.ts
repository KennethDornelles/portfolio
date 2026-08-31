import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RefreshJwtPayload } from '../auth.types';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: RefreshJwtPayload) {
    const refreshToken = req.get('authorization')?.replace('Bearer', '').trim();

    if (!refreshToken) throw new ForbiddenException('Refresh token malformed');

    return {
      userId: payload.sub,
      role: payload.role,
      refreshToken,
    };
  }
}
