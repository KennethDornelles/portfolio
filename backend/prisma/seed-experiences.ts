import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding professional experiences (Verified Version)...');

  // Limpa experiências existentes
  await prisma.experience.deleteMany();

  const experiences = [
    {
      role: 'Desenvolvedor Full Stack Pleno',
      company: 'CroSoften',
      period: 'Abril 2025 - Presente',
      focus: 'Desenvolvimento de arquiteturas escaláveis e modernização de sistemas de alta demanda.',
      highlights: [
        'Liderança técnica no desenvolvimento de novas features utilizando Node.js e NestJS.',
        'Otimização estratégica de queries e reestruturação de bancos de dados para garantir performance.'
      ],
      techStack: [
        { name: 'Node.js', color: 'bg-green-600' },
        { name: 'NestJS', color: 'bg-red-600' },
        { name: 'TypeScript', color: 'bg-blue-500' }
      ],
      order: 1
    },
    {
      role: 'Sócio-Fundador & Product Engineer',
      company: 'OluStack',
      period: 'Janeiro 2024 - Presente',
      focus: 'Concepção e desenvolvimento de ecossistemas SaaS de ponta a ponta.',
      highlights: [
        'BarberBoss: Plataforma SaaS de gestão comercial com foco em experiência do usuário e pagamentos.',
        'PetBoss: Engine de logística e geolocalização utilizando PostGIS para serviços pet.'
      ],
      techStack: [
        { name: 'NestJS', color: 'bg-red-600' },
        { name: 'Angular 19', color: 'bg-pink-600' },
        { name: 'PostgreSQL (PostGIS)', color: 'bg-blue-600' },
        { name: 'Redis', color: 'bg-red-500' }
      ],
      order: 2
    },
    {
      role: 'Backend Developer',
      company: 'Unimed',
      period: 'Fevereiro 2025 - Outubro 2025',
      focus: 'Desenvolvimento em ambiente crítico de saúde com foco em integração de dados.',
      highlights: [
        'Criação de APIs de integração e rotinas complexas em SQL (Oracle/PL-SQL).',
        'Garantia de integridade e performance em sistemas de missão crítica hospitalar.'
      ],
      techStack: [
        { name: 'SQL', color: 'bg-orange-600' },
        { name: 'Oracle', color: 'bg-red-700' },
        { name: 'PostgreSQL', color: 'bg-blue-500' }
      ],
      order: 3
    },
    {
      role: 'Analista de Sistemas',
      company: 'Lojas Renner S.A.',
      period: 'Janeiro 2024 - Dezembro 2024',
      focus: 'Sustentação e monitoramento de sistemas transacionais de larga escala.',
      highlights: [
        'Resolução de incidentes críticos em ambiente de varejo com alta volumetria de dados.',
        'Análise de performance e otimização de fluxos sistêmicos de alta demanda.'
      ],
      techStack: [
        { name: 'Sistemas Distribuídos', color: 'bg-gray-600' },
        { name: 'Performance Tuning', color: 'bg-yellow-600' }
      ],
      order: 4
    },
    {
      role: 'Desenvolvedor Backend (Node.js)',
      company: 'PurpleCats',
      period: 'Março 2022 - Dezembro 2023',
      focus: 'Arquitetura de microsserviços para o setor de Fintech.',
      highlights: [
        'Desenvolvimento de APIs atendendo mais de 10.000 usuários ativos diários.',
        'Implementação de infraestrutura AWS, pipelines CI/CD e testes automatizados com Jest.'
      ],
      techStack: [
        { name: 'Node.js', color: 'bg-green-600' },
        { name: 'AWS', color: 'bg-orange-500' },
        { name: 'Microsserviços', color: 'bg-purple-600' },
        { name: 'Jest', color: 'bg-red-800' }
      ],
      order: 5
    }
  ];

  for (const exp of experiences) {
    await prisma.experience.create({
      data: exp
    });
  }

  console.log('✅ Base de dados de experiências atualizada com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
