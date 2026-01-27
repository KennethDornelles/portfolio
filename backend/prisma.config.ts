import { defineConfig } from '@prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    // No Prisma 7, a URL é injetada aqui
    url: process.env.DATABASE_URL,
  },
});
