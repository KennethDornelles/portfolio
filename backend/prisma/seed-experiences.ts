import * as dotenv from 'dotenv';
dotenv.config();

import { createPrismaClient } from './client';

const prisma = createPrismaClient();

async function main() {
  console.log('Seeding professional experiences (Verified Version)...');

  // Limpa experiências existentes
  await prisma.experience.deleteMany();

  const experiences = [
    {
      role: 'EXP_CROS_ROLE',
      company: 'CroSoften',
      period: 'EXP_CROS_PERIOD',
      focus: 'EXP_CROS_FOCUS',
      highlights: ['EXP_CROS_HIGHLIGHT_1', 'EXP_CROS_HIGHLIGHT_2'],
      results: ['EXP_CROS_RESULT_1', 'EXP_CROS_RESULT_2'],
      techStack: [
        { name: 'Node.js', color: 'bg-green-600' },
        { name: 'NestJS', color: 'bg-red-600' },
        { name: 'TypeScript', color: 'bg-blue-500' },
      ],
      order: 3,
    },
    {
      role: 'EXP_OLU_ROLE',
      company: 'OluStack',
      period: 'EXP_OLU_PERIOD',
      focus: 'EXP_OLU_FOCUS',
      highlights: ['EXP_OLU_HIGHLIGHT_1', 'EXP_OLU_HIGHLIGHT_2'],
      results: ['EXP_OLU_RESULT_1', 'EXP_OLU_RESULT_2'],
      techStack: [
        { name: 'NestJS', color: 'bg-red-600' },
        { name: 'Angular 19', color: 'bg-pink-600' },
        { name: 'PostgreSQL (PostGIS)', color: 'bg-blue-600' },
        { name: 'Redis', color: 'bg-red-500' },
      ],
      order: 1,
    },
    {
      role: 'EXP_UNIMED_ROLE',
      company: 'Unimed',
      period: 'EXP_UNIMED_PERIOD',
      focus: 'EXP_UNIMED_FOCUS',
      highlights: ['EXP_UNIMED_HIGHLIGHT_1', 'EXP_UNIMED_HIGHLIGHT_2'],
      results: ['EXP_UNIMED_RESULT_1', 'EXP_UNIMED_RESULT_2'],
      techStack: [
        { name: 'SQL', color: 'bg-orange-600' },
        { name: 'Oracle', color: 'bg-red-700' },
        { name: 'PostgreSQL', color: 'bg-blue-500' },
      ],
      order: 4,
    },
    {
      role: 'EXP_COED_ROLE',
      company: 'Escola de Computação Solidária (COED)',
      period: 'EXP_COED_PERIOD',
      focus: 'EXP_COED_FOCUS',
      highlights: ['EXP_COED_HIGHLIGHT_1', 'EXP_COED_HIGHLIGHT_2'],
      results: ['EXP_COED_RESULT_1', 'EXP_COED_RESULT_2'],
      techStack: [
        { name: 'Video Production', color: 'bg-purple-600' },
        { name: 'Presentation Design', color: 'bg-orange-500' },
        { name: 'Technical Communication', color: 'bg-cyan-600' },
      ],
      order: 2,
    },
    {
      role: 'EXP_RENNER_ROLE',
      company: 'Lojas Renner S.A.',
      period: 'EXP_RENNER_PERIOD',
      focus: 'EXP_RENNER_FOCUS',
      highlights: ['EXP_RENNER_HIGHLIGHT_1', 'EXP_RENNER_HIGHLIGHT_2'],
      results: ['EXP_RENNER_RESULT_1', 'EXP_RENNER_RESULT_2'],
      techStack: [
        { name: 'EXP_TECH_DISTRIBUTED', color: 'bg-gray-600' },
        { name: 'Performance Tuning', color: 'bg-yellow-600' },
      ],
      order: 5,
    },
    {
      role: 'EXP_PURPLE_ROLE',
      company: 'PurpleCats',
      period: 'EXP_PURPLE_PERIOD',
      focus: 'EXP_PURPLE_FOCUS',
      highlights: ['EXP_PURPLE_HIGHLIGHT_1', 'EXP_PURPLE_HIGHLIGHT_2'],
      results: ['EXP_PURPLE_RESULT_1', 'EXP_PURPLE_RESULT_2'],
      techStack: [
        { name: 'Node.js', color: 'bg-green-600' },
        { name: 'AWS', color: 'bg-orange-500' },
        { name: 'EXP_TECH_MICROSERVICES', color: 'bg-purple-600' },
        { name: 'Jest', color: 'bg-red-800' },
      ],
      order: 6,
    },
  ];

  for (const exp of experiences) {
    await prisma.experience.create({
      data: exp,
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
