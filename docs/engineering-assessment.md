# Diagnóstico de engenharia

**Data da análise:** 30 de agosto de 2026  
**Escopo:** frontend Angular, backend NestJS, Prisma/PostgreSQL, Redis/BullMQ, Docker Compose e GitHub Actions.  
**Método:** inspeção estática do código e das configurações versionadas. Nenhum arquivo de aplicação foi alterado durante a análise inicial.

## Sumário executivo

O projeto possui uma fundação modular razoável: frontend e backend separados, módulos de domínio no NestJS, repositories abstraídos, DTOs, validação global, Prisma, Redis, fila e SSR. O principal gargalo não é a escolha da stack, mas a falta de mecanismos que mantenham suas partes sincronizadas.

As ameaças imediatas são:

1. endpoints operacionais públicos e um segredo administrativo fixo no código;
2. erro na rotação de refresh token que substitui o papel do usuário por um UUID;
3. contratos HTTP divergentes entre frontend e backend;
4. schema Prisma à frente das migrations versionadas;
5. ausência de CI para impedir regressões;
6. autenticação do frontend baseada apenas na presença de strings no `localStorage`.

Enquanto esses pontos permanecerem, funcionalidades aparentemente concluídas podem falhar somente em integração ou produção.

## Visão do workspace

| Área | Tecnologia | Observação |
|---|---|---|
| Frontend | Angular 21, SSR, Signals, Tailwind | Componentes standalone e lazy loading já adotados |
| Backend | NestJS 11 | Separação por módulos e repositories |
| Dados | PostgreSQL/PostGIS e Prisma | Há drift entre schema e migrations |
| Cache e filas | Redis, cache-manager e BullMQ | Cache i18n possui fallbacks complexos; fila é subutilizada |
| Operação | Docker Compose e GitHub Actions | Compose é voltado a desenvolvimento; CI não existe |
| Testes | Jest, Supertest e Vitest | Cobertura muito pequena para os fluxos críticos |

## Descobertas priorizadas

### Críticas

#### SEC-001 — Endpoints operacionais i18n estão expostos

`backend/src/modules/i18n/i18n.controller.ts` contém:

- webhook de deploy público sem validação de assinatura;
- diagnóstico de cache/banco público;
- limpeza de cache por `GET`;
- segredo literal `temp-admin-secret-2024` aceito como credencial;
- segredo recebido por query string;
- stack trace retornado ao cliente em falhas.

**Impacto:** terceiros podem acionar trabalho no banco/Redis, invalidar cache e obter detalhes internos. Query strings podem ser registradas por proxies e ferramentas de observabilidade.

**Direção:** remover o segredo fixo, autenticar operações administrativas, validar webhooks com HMAC e usar `POST` para comandos mutáveis. Respostas públicas nunca devem incluir stack trace.

#### SEC-002 — Refresh token perde o papel do usuário

Em `backend/src/modules/auth/auth.service.ts`, a rotação chama:

```ts
generateTokens(userId, tokenRecord.userId)
```

O segundo parâmetro representa `role`, mas recebe um UUID. Após renovar a sessão, o JWT deixa de carregar um papel válido.

**Impacto:** sessões administrativas podem perder autorização após o refresh. A lógica de autorização torna-se dependente de um token defeituoso.

**Direção:** carregar o usuário ativo no banco durante a rotação, validar que o token pertence ao mesmo usuário e gerar os novos tokens com o papel persistido.

#### SEC-003 — Secrets possuem fallbacks inseguros

O backend aceita `secret` como fallback do `JWT_SECRET`, enquanto o Docker Compose contém chaves JWT conhecidas e fixas.

**Impacto:** uma implantação incompleta pode iniciar assinando tokens com segredo previsível.

**Direção:** validar todas as variáveis obrigatórias no startup e encerrar o processo quando forem inválidas ou ausentes. O Compose deve consumir secrets externos.

#### API-001 — Contratos frontend/backend estão divergentes

| Operação | Frontend | Backend |
|---|---|---|
| Cadastro | `POST /auth/register` | `POST /auth/signup` |
| Marcar contato como lido | `PATCH /contacts/:id` | `PATCH /contacts/:id/read` |
| Excluir contato | `DELETE /contacts/:id` | Não implementado |
| Atualizar projeto | `PUT /projects/:id` | `PATCH /projects/:id` |
| Atualizar tecnologia | `PUT /technologies/:id` | `PATCH /technologies/:id` |

**Impacto:** cadastro e partes do painel administrativo falham mesmo que frontend e backend compilem isoladamente.

**Direção:** corrigir os contratos atuais e adotar um cliente TypeScript gerado pelo OpenAPI como fonte única para rotas e DTOs.

#### API-002 — Formulário de contato não está explicitamente público

O backend registra `JwtAuthGuard` globalmente, mas `POST /contacts` não usa `@Public()`. O formulário do site envia a requisição como visitante.

**Impacto:** submissões legítimas tendem a receber `401`.

**Direção:** declarar o endpoint público e protegê-lo com rate limit específico, validação e medidas antispam.

#### DB-001 — Schema e migrations não representam o mesmo banco

Foram identificados:

- papel `GUEST` presente no schema, ausente na migration do enum;
- model `Experience` sem migration versionada;
- campos `category` e `proficiencyLevel` de `Technology` apenas em SQL na pasta `migrations/manual`;
- `DIRECT_URL` obrigatório no schema, mas ausente no Compose e no `.env.example`.

**Impacto:** um banco criado do zero com migrations não atende ao código atual. Ambientes podem ter estruturas diferentes.

**Direção:** criar migrations Prisma formais, validar um banco descartável e impedir drift no CI.

### Altas

#### AUTH-001 — Estado de autenticação do Angular não é confiável

O guard administrativo libera a rota apenas pela existência de `admin_token`. O serviço geral considera o usuário autenticado pela presença de `access_token`, sem validar expiração, papel ou identidade. Em modo guest, indisponibilidade do backend gera um token mock e estado autenticado.

**Impacto:** a interface apresenta estados falsos e mascara indisponibilidade. A proteção efetiva fica inteiramente no backend.

**Direção:** consolidar autenticação em uma única facade, validar sessão no startup, tratar expiração/refresh e limitar mocks a uma configuração de desenvolvimento explícita.

#### CI-001 — Não existe esteira de integração contínua

O único workflow versionado faz keep-alive da API. Não há build, lint, testes, validação Prisma ou verificação da imagem Docker.

**Impacto:** regressões de contrato, tipagem e migrations chegam ao branch principal sem bloqueio.

**Direção:** adicionar checks obrigatórios em pull requests e pushes para o branch principal.

#### TEST-001 — Fluxos críticos não possuem cobertura automatizada

O workspace contém um teste unitário simples do backend, dois arquivos E2E e um teste básico do Angular. Não há cobertura adequada para autenticação, autorização, refresh, contatos, cache/i18n ou CRUD administrativo.

**Impacto:** refactors e correções de segurança têm alto risco de regressão.

**Direção:** começar por testes de contrato e jornadas críticas, não por meta genérica de percentual.

#### ARCH-001 — Componentes Angular acumulam acesso a dados e apresentação

Diversos componentes administrativos chamam `HttpClient` diretamente e repetem URLs, loading state, tratamento de erros e tipos. Há componentes entre aproximadamente 250 e 315 linhas.

**Impacto:** mudanças de API exigem edições dispersas e testes de UI ficam mais difíceis.

**Direção:** introduzir clientes/facades por domínio e separar componentes de apresentação quando houver ganho claro.

#### CACHE-001 — Invalidação i18n é complexa e acoplada ao Redis

O serviço i18n mantém três níveis de fallback para limpar cache, incluindo conexão Redis emergencial e acesso a detalhes internos do cache-manager.

**Impacto:** mais caminhos de falha, conexões extras e baixa testabilidade.

**Direção:** adotar chaves versionadas, por exemplo `i18n:v42:PT_BR`, tornando a invalidação uma troca atômica de versão.

### Médias

#### TYPE-001 — Uso de `any` nas fronteiras críticas

JWT, usuário autenticado, auditoria, i18n, cache, requests e respostas administrativas usam `any`.

**Impacto:** `strict` e `noImplicitAny` não protegem justamente as integrações mais sensíveis.

**Direção:** criar tipos explícitos para payload JWT, usuário autenticado, respostas de auth, metadados de auditoria, traduções e DTOs administrativos.

#### OPS-001 — Configuração está dispersa

O backend mistura `ConfigService`, `process.env` e valores hardcoded. CORS, Redis, TTL e expiração JWT aparecem em múltiplos locais.

**Impacto:** ambientes se comportam de forma diferente e erros são descobertos tarde.

**Direção:** configurar e validar os domínios `auth`, `database`, `redis`, `cors` e `mail` em um único módulo tipado.

#### OBS-001 — Observabilidade inconsistente

Embora Pino esteja instalado, ainda existem muitos `console.log/error`, inclusive informações de configuração, conteúdo de e-mail e parte do secret JWT. O interceptor de performance só está aplicado ao i18n; o transform interceptor não está registrado globalmente.

**Impacto:** logs não estruturados, risco de exposição e diagnóstico incompleto.

**Direção:** usar logger estruturado, redaction, request ID e métricas para HTTP, Redis, banco e filas.

#### PERF-001 — Listagens não possuem paginação

Usuários, contatos, projetos e tecnologias usam `findMany` sem paginação.

**Impacto:** o custo cresce linearmente com os dados e o painel transfere mais informação do que precisa.

**Direção:** padronizar paginação, ordenação e filtros, priorizando contatos e auditoria.

#### MAIL-001 — Envio de contato está no caminho síncrono

O serviço cria o contato e aguarda `sendWelcome`, reutilizado provisoriamente como notificação.

**Impacto:** latência e confiabilidade do formulário ficam acopladas ao provedor de e-mail.

**Direção:** publicar um job específico na fila após persistir o contato e processar com retry e idempotência.

#### DX-001 — Documentação operacional ainda é template

Os READMEs do backend e frontend são os textos gerados pelos frameworks e não explicam arquitetura, variáveis, migrations ou execução integrada.

**Impacto:** onboarding lento e dependência de conhecimento tácito.

**Direção:** criar README raiz e substituir os templates por instruções específicas do projeto.

## Pontos positivos a preservar

- módulos de domínio bem identificados no backend;
- abstrações de repository para boa parte do acesso a dados;
- DTOs com validação global e whitelist;
- lazy loading e componentes standalone no Angular;
- logging estruturado, cache e fila já disponíveis na stack;
- health checks e auditoria já iniciados;
- TypeScript em modo estrito no frontend e regras importantes no backend.

## Limitações desta análise

`node_modules` não estava instalado no frontend nem no backend. Por isso, não foram executados build, lint, testes, migrations ou auditoria de dependências. As descobertas são baseadas no código e nas configurações versionadas e devem ser complementadas pelos resultados da primeira execução do pipeline descrito no backlog.

