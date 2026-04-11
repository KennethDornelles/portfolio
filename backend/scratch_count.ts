import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const c = await prisma.translation.findMany({ where: { language: 'PT_BR' } });
  console.log('PT_BR count:', c.length);
}
main();
