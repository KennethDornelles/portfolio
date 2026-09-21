# Runbook de desenvolvimento e entrega

Este documento é o ponto de entrada operacional do OluStack Portfolio. Os comandos abaixo assumem PowerShell ou um shell compatível e devem ser executados a partir da raiz do repositório.

## Pré-requisitos

- Node.js 20+ e npm.
- Docker Desktop com Compose v2.
- Acesso ao PostgreSQL e Redis locais (ou aos serviços equivalentes configurados nas variáveis).
- Wrangler autenticado somente quando for operar o R2/CDN.

Nunca versione `.env`, tokens, senhas ou chaves de API. Use `backend/.env.example` como referência e preencha os valores localmente.

## Inicialização local

```powershell
Copy-Item .env.example .env
Copy-Item backend/.env.example backend/.env
npm --prefix backend install
npm --prefix frontend install
docker compose up -d postgres redis
```

O Compose exige, no mínimo, `POSTGRES_PASSWORD`, `JWT_SECRET`, `JWT_REFRESH_SECRET` e `I18N_WEBHOOK_SECRET` no `.env` da raiz. Para usar o backend dentro do Compose:

```powershell
docker compose up -d --build
```

Para executar a API fora do container, mantenha PostgreSQL/Redis ativos e rode `npm --prefix backend run start:dev`.

## Banco de dados

Em ambiente local descartável ou de desenvolvimento:

```powershell
npm --prefix backend run db:setup
```

Esse comando aplica migrations e executa o seed principal. Para cargas específicas:

```powershell
npm --prefix backend run seed:translations
npm --prefix backend run seed:experiences
npm --prefix backend run seed:all
```

Em produção, use apenas migrations versionadas e seeds idempotentes após backup/janela de mudança:

```powershell
npm --prefix backend run db:setup
```

Confirme `DATABASE_URL`, `DIRECT_URL` e o ambiente antes de executar. Não use `migrate reset` em produção.

## Execução e validação

```powershell
npm --prefix backend run lint
npm --prefix backend run build
npm --prefix backend test -- --runInBand
npm --prefix frontend run build
```

Endpoints básicos:

```powershell
curl.exe -i http://localhost:3000/api/health
curl.exe -i -H "X-Request-Id: dx-001" http://localhost:3000/api/health
```

O segundo comando deve devolver o mesmo `X-Request-Id`. Logs de requisições usam o evento `http.request.completed`; jobs de e-mail usam `mail.job.started` e `mail.job.completed`.

## Contrato OpenAPI

Com a API local em execução, atualize o cliente Angular tipado:

```powershell
npm --prefix frontend run api:generate
```

Revise o diff de `frontend/src/app/core/api/generated.ts` antes de commitar.

## R2 e CDN

Operações de mídia devem usar o bucket configurado e nunca credenciais no código. Exemplo de conexão do domínio já provisionado:

```powershell
wrangler r2 bucket domain add olustack-portfolio-media `
  --domain cdn.olustack.com.br `
  --zone-id "<ZONE_ID>" `
  --min-tls 1.2 `
  --force
```

Valide o objeto pelo domínio CDN antes de referenciá-lo no frontend:

```powershell
curl.exe -I https://cdn.olustack.com.br/cases/explorajp-demo.mp4
```

## Fluxo de branch e deploy

1. Crie uma branch vinculada ao código do backlog (`feat/<codigo>` ou `chore/<codigo>`).
2. Rode lint, build e testes direcionados.
3. Revise o diff e abra PR para revisão.
4. Faça merge na `main` somente após os checks do CI.
5. Após o deploy, valide healthcheck, rotas públicas, autenticação administrativa, i18n, CDN e formulário de contato.

Não faça deploy direto da máquina local para produção. O deploy deve ser reproduzível pelo CI/serviço configurado.

## Troubleshooting rápido

- **Empty reply no localhost:3000:** confirme `docker compose ps`, logs do backend e se a porta está ocupada; execute o `curl.exe` em uma linha única.
- **Compose pede variáveis:** preencha o `.env` da raiz com os secrets obrigatórios; não use valores reais em commits.
- **i18n indisponível:** confira Redis, `I18N_WEBHOOK_SECRET` e o healthcheck de cache.
- **R2/CDN não responde:** verifique status da zona Cloudflare, domínio customizado do bucket e propagação DNS.
- **Prerender retorna 500:** valide se a API de produção está disponível e se os endpoints usados no SSR têm dados; o build ainda pode gerar os bundles, mas o erro deve ser corrigido antes da publicação.
