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

## Avaliação Prisma 7 (branch `chore/dep-001-prisma7-evaluation`)

Na branch isolada, Prisma, `@prisma/client` e `@prisma/config` foram atualizados para 7.10.0. Foi necessário remover `url` e `directUrl` do datasource do schema, mover a URL de migration para `prisma.config.ts` e adaptar `PrismaService` para `@prisma/adapter-pg`.

Resultados:

- `prisma validate`: passou;
- `prisma generate`: passou;
- `prisma migrate status` no PostgreSQL local: schema atualizado, 5 migrations reconhecidas;
- build backend: passou;
- lint backend: passou;
- testes unitários: 12 suites e 63 testes passaram;
- E2E local: 2 suites e 21 testes passaram;
- `npm audit --omit=dev`: ainda reporta advisories altos em `deepmerge-ts` e `mysql2`, sem correção automática disponível.

A avaliação confirma que a migração é tecnicamente viável, mas não elimina todos os advisories e exige mudanças de runtime/configuração. Não fazer merge sem revisão dos impactos operacionais e decisão sobre os advisories residuais.

## Análise dos advisories residuais

### `deepmerge-ts` — GHSA-ggr8-5vv4-36mx

O pacote está presente como dependência fixa de `@prisma/config@7.10.0` e é utilizado no carregamento/merge da configuração do Prisma. O projeto não fornece objetos recursivos controlados por usuário para esse caminho; o risco principal está em ferramentas de build, migration e execução da CLI com arquivos de configuração adulterados.

Mitigação imediata: manter `prisma.config.ts` versionado, simples e sem entrada de configuração externa não confiável; restringir execução da CLI a CI/desenvolvimento controlados; não aplicar `overrides` para `deepmerge-ts@8` sem teste de compatibilidade. A correção definitiva depende de uma versão do Prisma que atualize essa dependência.

### `mysql2` — GHSA-3f6p-5ww8-9rcr

O pacote é instalado exclusivamente pelo Prisma CLI para suporte a conectores MySQL. A aplicação utiliza PostgreSQL com `@prisma/adapter-pg` e não importa `mysql2`. Não há conexão MySQL no código ou no Compose.

Mitigação imediata: não aceitar URLs MySQL nos ambientes do projeto, manter `DATABASE_URL`/`DIRECT_URL` em PostgreSQL e evitar executar a CLI com configuração fornecida por terceiros. Remover o pacote manualmente não é seguro porque ele é dependência do Prisma CLI.

### Itens propagados pelo npm

`prisma`, `@prisma/client` e `@nestjs/terminus` aparecem como vulneráveis por propagação da árvore (`via`), não por uma falha independente identificada nesses módulos. Não devem ser substituídos isoladamente.

## Plano de ação

1. Manter a branch Prisma 7 isolada até revisão e decisão de merge.
2. Acompanhar releases do Prisma e executar `npm audit` em cada atualização de patch.
3. Criar uma imagem/runtime de produção sem ferramentas de migration quando o pipeline permitir; executar migrations em etapa separada com dependências de build/CLI.
4. Em experimento descartável, testar `overrides` para `deepmerge-ts@8` e verificar `validate`, `generate`, migrations, testes e build. Reverter se houver incompatibilidade.
5. Se não houver correção transitiva oficial, planejar atualização futura do Prisma com changelog revisado e validação completa de banco descartável.

Critério de encerramento: `npm audit --omit=dev` sem advisories altos na cadeia Prisma, ou aceite formal do risco residual após comprovar que CLI/configuração não recebem entrada não confiável e que o runtime de produção não contém ferramentas desnecessárias.
