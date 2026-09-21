# Configuração de ambiente

O backend carrega as variáveis de ambiente no startup e as expõe aos módulos por meio do registro tipado `app` (`backend/src/config/app.config.ts`). Nunca versione `backend/.env` ou valores reais de secrets.

## Obrigatórias

| Variável | Uso |
| --- | --- |
| `DATABASE_URL` | Conexão PostgreSQL usada pela aplicação |
| `DIRECT_URL` | Conexão PostgreSQL direta para migrations e operações administrativas |
| `JWT_SECRET` | Assinatura dos tokens de acesso (mínimo de 32 caracteres) |
| `JWT_REFRESH_SECRET` | Assinatura dos refresh tokens; deve ser diferente do `JWT_SECRET` |
| `I18N_WEBHOOK_SECRET` | Autenticação do webhook de invalidação i18n (mínimo de 32 caracteres) |

## Runtime

| Variável | Padrão local | Uso |
| --- | --- | --- |
| `NODE_ENV` | `development` | Ambiente de execução |
| `PORT` | `3000` | Porta HTTP da API |
| `BACKEND_URL` | `http://localhost:3000` | URL pública da API |
| `FRONTEND_URL` | `http://localhost:4200` | Origem principal do frontend |
| `REDIS_URL` | — | URL completa do Redis, quando disponível |
| `REDIS_HOST` | `localhost` | Host Redis quando `REDIS_URL` não é usado |
| `REDIS_PORT` | `6379` | Porta Redis quando `REDIS_URL` não é usado |

## Email e seeds

| Variável | Uso |
| --- | --- |
| `RESEND_API_KEY` | Ativa o provider Resend; sem ela o provider de desenvolvimento registra no console |
| `MAIL_FROM` | Remetente das mensagens enviadas |
| `CONTACT_ALERT_RECIPIENT` | Destinatário dos alertas de novos contatos; fallback para `ADMIN_EMAIL` |
| `ADMIN_SEED_EMAIL` | Email do administrador criado pelo seed |
| `ADMIN_SEED_PASSWORD` | Senha usada pelo seed do administrador |

Para desenvolvimento, copie `backend/.env.example` para `backend/.env` e preencha os valores locais. Em produção, configure secrets no provedor de deploy; não use o arquivo `.env` no container.

## Fluxo de configuração

1. `ConfigModule` valida os secrets obrigatórios no startup.
2. `app.config.ts` normaliza porta, URLs e conexão Redis.
3. Módulos Nest consomem `ConfigService` usando chaves `app.*`.
4. Migrations devem usar `DIRECT_URL`; a aplicação pode usar o pooler em `DATABASE_URL`.
