import * as dotenv from 'dotenv';
dotenv.config();

import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { seedTranslations } from './seed-translations';

const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL },
  },
});

async function main() {
  console.log('Starting database seeding...');
  await seedTranslations(prisma);

  const adminEmail = (process.env.ADMIN_SEED_EMAIL || process.env.ADMIN_EMAIL)
    ?.trim()
    .toLowerCase();
  const adminPassword =
    process.env.ADMIN_SEED_PASSWORD || process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn(
      'ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD are not configured; admin seed skipped.',
    );
  } else {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const update = { passwordHash, role: UserRole.ADMIN, isActive: true };
    await prisma.user.upsert({
      where: { email: adminEmail },
      create: { email: adminEmail, ...update },
      update:
        process.env.NODE_ENV === 'production'
          ? { role: UserRole.ADMIN, isActive: true }
          : update,
    });
    console.log(`Admin user ready: ${adminEmail}`);
  }

  const technologies = [
    { name: 'React', icon: 'react-icon-url' },
    { name: 'Node.js', icon: 'nodejs-icon-url' },
    { name: 'NestJS', icon: 'nestjs-icon-url' },
    { name: 'TypeScript', icon: 'typescript-icon-url' },
    { name: 'Docker', icon: 'docker-icon-url' },
    { name: 'PostgreSQL', icon: 'postgresql-icon-url' },
  ];

  for (const tech of technologies) {
    const existingTech = await prisma.technology.findUnique({
      where: { name: tech.name },
    });
    if (!existingTech) await prisma.technology.create({ data: tech });
  }
  console.log('Seeding completed.');
}

main()
  .catch((error: unknown) => {
    console.error(
      'Database seed failed',
      error instanceof Error ? error.message : 'unknown error',
    );
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
