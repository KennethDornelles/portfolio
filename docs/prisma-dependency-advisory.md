# Advisory de dependências Prisma

Data: 02/09/2026

## Descoberta

O `npm audit` do backend identifica um advisory de alta severidade (GHSA-ggr8-5vv4-36mx) em `deepmerge-ts` nas versões anteriores à 8.0.0. A dependência é transitiva de `@prisma/config`, utilizada por `prisma` e relacionada no relatório também a `@prisma/client` e `@nestjs/terminus`.

## Estado validado

- `prisma`, `@prisma/client` e `@prisma/config`: linha 6.19.3;
- `deepmerge-ts`: 7.1.5, fixada pela configuração do Prisma 6;
- `npm audit`: 5 vulnerabilidades altas, sem correção automática disponível;
- frontend: 0 vulnerabilidades após instalação limpa;
- nenhuma atualização major, override transitive ou `npm audit fix --force` foi aplicada.

## Próximo passo recomendado

Criar o item `DEP-001` e avaliar uma migração controlada para Prisma 7 em branch isolada. Validar compatibilidade de Node.js/NestJS, `prisma.config.ts`, geração do client, migrations em banco descartável, testes, E2E e build antes de qualquer adoção.

Como alternativa experimental, pode-se testar `deepmerge-ts@8` via `overrides`, mas isso não deve ser aplicado diretamente: o Prisma 6 declara `deepmerge-ts@7.1.5` explicitamente e o override pode introduzir incompatibilidade.

Até essa avaliação, o risco permanece registrado e deve ser acompanhado com novas versões do Prisma e execuções periódicas de `npm audit`.
