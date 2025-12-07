export default () => ({
  environment: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  api: {
    prefix: process.env.API_PREFIX || 'api',
  },
  apiKey: process.env.API_KEY,
  database: {
    url: process.env.DATABASE_URL,
  },
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    credentials: true,
  },
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL || '60000', 10), // milissegundos
    limit: parseInt(process.env.THROTTLE_LIMIT || '10', 10), // número de requisições
  },
});
