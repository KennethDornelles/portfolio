import { registerAs } from '@nestjs/config';

export interface AppConfig {
  nodeEnv: 'development' | 'test' | 'production';
  port: number;
  backendUrl: string;
  frontendUrl: string;
  databaseUrl?: string;
  redis: {
    url?: string;
    host: string;
    port: number;
  };
}

export default registerAs('app', (): AppConfig => ({
  nodeEnv: (process.env.NODE_ENV as AppConfig['nodeEnv']) || 'development',
  port: Number(process.env.PORT || 3000),
  backendUrl: process.env.BACKEND_URL || 'http://localhost:3000',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:4200',
  databaseUrl: process.env.DATABASE_URL,
  redis: {
    url: process.env.REDIS_URL,
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT || 6379),
  },
}));
