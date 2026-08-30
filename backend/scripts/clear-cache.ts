import Redis from 'ioredis';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load env from one level up (backend root) if running from scripts folder
dotenv.config({ path: join(__dirname, '..', '.env') });
// Also try default location
dotenv.config();

async function clearCache() {
  console.log('Starting cache clearing...');
  
  const url = process.env.REDIS_URL;
  const host = process.env.REDIS_HOST || 'localhost';
  const port = parseInt(process.env.REDIS_PORT || '6379', 10);

  const client = url ? new Redis(url, { lazyConnect: true }) : new Redis({ host, port, lazyConnect: true });

  client.on('error', (err: Error) => console.error('Redis Client Error', err));

  try {
    await client.connect();
    console.log('Connected to Redis.');

    const keys = await client.keys('i18n:*');
    console.log(`Found ${keys.length} keys matching 'i18n:*'`);

    if (keys.length > 0) {
      await client.del(...keys);
      console.log('Successfully deleted i18n keys.');
    } else {
      console.log('No keys to delete.');
    }

  } catch (e) {
    console.error('Error during execution:', e);
  } finally {
    await client.quit();
    console.log('Disconnected.');
  }
}

clearCache();

