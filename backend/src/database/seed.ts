import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Exemplo: Criar informações pessoais iniciais
  const personalInfo = await prisma.personalInfo.upsert({
    where: { id: '1' },
    update: {},
    create: {
      name: 'Seu Nome',
      title: 'Full Stack Developer',
      bio: 'Desenvolvedor apaixonado por criar soluções inovadoras.',
      email: 'seu.email@exemplo.com',
      phone: '+55 (11) 99999-9999',
      location: 'São Paulo, Brasil',
    },
  });

  console.log('Personal info created:', personalInfo);

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
