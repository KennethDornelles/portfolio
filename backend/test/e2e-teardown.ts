import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { INestApplication } from '@nestjs/common';
import { getQueueToken } from '@nestjs/bullmq';
import { Cache } from 'cache-manager';
import { Queue } from 'bullmq';
import { PrismaService } from '../src/modules/prisma/prisma.service';

interface ClosableClient {
  quit?: () => Promise<unknown>;
  disconnect?: () => Promise<unknown>;
}

export async function closeE2eInfrastructure(
  app: INestApplication,
  prisma: PrismaService,
): Promise<void> {
  const cache = app.get<Cache>(CACHE_MANAGER);
  const cacheClients = (cache.stores ?? [])
    .map(
      (store) =>
        (store.store as { client?: ClosableClient } | undefined)?.client,
    )
    .filter((client): client is ClosableClient => Boolean(client));

  const queue = app.get<Queue>(getQueueToken('mail'), { strict: false });
  try {
    await Promise.all(cacheClients.map((client) => closeClient(client)));
    await queue.close();
  } finally {
    try {
      await app.close();
    } finally {
      await prisma.$disconnect();
    }
  }
}

async function closeClient(client: ClosableClient): Promise<void> {
  if (client.quit) {
    await client.quit();
  } else if (client.disconnect) {
    await client.disconnect();
  }
}
