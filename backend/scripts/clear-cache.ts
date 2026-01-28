import { createClient } from 'redis';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load env from one level up (backend root) if running from scripts folder
dotenv.config({ path: join(__dirname, '..', '.env') });
// Also try default location
dotenv.config();

async function clearCache() {
  console.log('Starting cache clearing...');
  
  const url = process.env.REDIS_URL || 
             (process.env.REDIS_HOST ? `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT || 6379}` : undefined);

  if (!url) {
    console.error('REDIS_URL or REDIS_HOST not defined in environment variables.');
    process.exit(1);
  }

  // Handle Render's rediss:// if needed, or simple parsing. 
  // The 'redis' package handles most connection strings automatically.
  // We need to be careful about TLS if it's 'rediss'
  
  const options: any = { url };
  if (url.startsWith('rediss://')) {
      options.socket = {
          tls: true,
          rejectUnauthorized: false // Often needed for some managed redis
      }
  }

  console.log(`Connecting to Redis at ${url.replace(/:[^:@]*@/, ':****@')}...`);

  const client = createClient(options);

  client.on('error', (err) => console.error('Redis Client Error', err));

  try {
    await client.connect();
    console.log('Connected.');

    const keys = await client.keys('i18n:*');
    console.log(`Found ${keys.length} keys matching 'i18n:*'`);

    if (keys.length > 0) {
      await client.del(keys);
      console.log('Successfully deleted i18n keys.');
    } else {
      console.log('No keys to delete.');
    }

  } catch (e) {
    console.error('Error during execution:', e);
  } finally {
    await client.disconnect();
    console.log('Disconnected.');
  }
}

clearCache();
