import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const translations = await prisma.translation.findMany({
    where: {
      translationKey: {
        key: { startsWith: 'ABOUT' }
      }
    },
    include: { translationKey: true }
  });
  console.log(translations.map(t => `${t.translationKey.key} [${t.language}]: ${t.value}`));
}
main();
