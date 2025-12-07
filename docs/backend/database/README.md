# Database Configuration

Esta pasta contém toda a configuração e arquivos relacionados ao banco de dados do projeto.

## Estrutura

```
src/database/
├── prisma/
│   ├── schema.prisma          # Schema do Prisma (modelos, enums, etc.)
│   └── migrations/            # Migrations do banco de dados
├── database.module.ts         # Módulo NestJS para o database
├── prisma.service.ts          # Service do Prisma para injeção de dependência
├── seed.ts                    # Script de seed para popular o banco
└── README.md                  # Esta documentação
```

**Nota:** O cliente Prisma é gerado em `node_modules/@prisma/client` automaticamente.

## Comandos Disponíveis

### Gerar Cliente Prisma
```bash
npm run prisma:generate
```

### Criar e Aplicar Migrations
```bash
npm run prisma:migrate
```

### Aplicar Migrations em Produção
```bash
npm run prisma:migrate:deploy
```

### Resetar Database (Desenvolvimento)
```bash
npm run prisma:migrate:reset
```

### Abrir Prisma Studio
```bash
npm run prisma:studio
```

### Executar Seed
```bash
npm run prisma:seed
```

## Configuração

### Schema Location
O schema do Prisma está localizado em: `src/database/prisma/schema.prisma`

### Client Output
O cliente Prisma é gerado em: `node_modules/@prisma/client` (padrão do Prisma)

### Migrations
As migrations são criadas em: `src/database/prisma/migrations/`

## Uso no Código

Para usar o Prisma Client nos seus módulos:

```typescript
import { PrismaClient } from '@prisma/client';
// ou use o PrismaService injetado via DI
```

Para injetar o PrismaService:

```typescript
import { PrismaService } from '@/database/prisma.service';

constructor(private readonly prisma: PrismaService) {}
```

## Notas Importantes

- O cliente Prisma é gerado automaticamente em `node_modules/@prisma/client`
- Sempre execute `npm run prisma:generate` após modificar o `schema.prisma`
- Migrations devem ser criadas em desenvolvimento e commitadas no repositório
- Use `prisma:migrate:deploy` em produção, nunca `prisma:migrate`
