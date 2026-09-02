const path = require('node:path');
const dotenv = require('dotenv');

const backendDir = path.resolve(__dirname, '..');
const rootDir = path.resolve(backendDir, '..');

// Load only local files. Values already exported by the shell take precedence.
dotenv.config({ path: path.join(rootDir, '.env'), override: false });
dotenv.config({
  path: path.join(backendDir, '.env.e2e.local'),
  override: true,
});

if (process.env.NODE_ENV !== 'test') {
  throw new Error('E2E tests require NODE_ENV=test');
}

const password = process.env.POSTGRES_PASSWORD;
if (!password) {
  throw new Error('E2E tests require local POSTGRES_PASSWORD');
}

for (const name of [
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'I18N_WEBHOOK_SECRET',
]) {
  if (!process.env[name]) {
    throw new Error(`E2E tests require local ${name}`);
  }
}

const localDatabaseUrl = `postgresql://postgres:${encodeURIComponent(password)}@localhost:5434/portfolio_db?schema=public`;
process.env.DATABASE_URL = localDatabaseUrl;
process.env.DIRECT_URL = localDatabaseUrl;
process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6379';

const parsed = new URL(localDatabaseUrl);
const blockedHost = /render|supabase|aws|amazonaws/i.test(parsed.hostname);
if (
  !['localhost', '127.0.0.1'].includes(parsed.hostname) ||
  parsed.port !== '5434' ||
  parsed.pathname !== '/portfolio_db' ||
  blockedHost
) {
  throw new Error('E2E database target is not the approved local database');
}

if (
  process.env.JWT_SECRET.length < 32 ||
  process.env.JWT_REFRESH_SECRET.length < 32 ||
  process.env.JWT_SECRET === process.env.JWT_REFRESH_SECRET
) {
  throw new Error('E2E JWT secrets are invalid');
}
