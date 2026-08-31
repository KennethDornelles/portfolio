import { UserRole } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  role: UserRole;
  iat: number;
}

export interface RefreshJwtPayload extends JwtPayload {
  jti?: string;
}
