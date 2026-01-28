
import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create Admin User
  const adminEmail = 'admin@portfolio.com';
  const adminPassword = 'password123';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        role: UserRole.ADMIN,
        isActive: true,
      },
    });
    console.log(`✅ Admin user created: ${adminEmail}`);
  } else {
    console.log(`ℹ️ Admin user already exists.`);
  }

  // 2. Create Initial Technologies
  const technologies = [
    { name: 'React', icon: 'react-icon-url' },
    { name: 'Node.js', icon: 'nodejs-icon-url' },
    { name: 'NestJS', icon: 'nestjs-icon-url' },
    { name: 'TypeScript', icon: 'typescript-icon-url' },
    { name: 'Docker', icon: 'docker-icon-url' },
    { name: 'PostgreSQL', icon: 'postgresql-icon-url' },
  ];

  for (const tech of technologies) {
    const existingTech = await prisma.technology.findUnique({ where: { name: tech.name } });
    if (!existingTech) {
      await prisma.technology.create({ data: tech });
      console.log(`✅ Technology created: ${tech.name}`);
    } else {
      console.log(`ℹ️ Technology already exists: ${tech.name}`);
    }
  }

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
