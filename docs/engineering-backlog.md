# Backlog de engenharia

**Origem:** [Diagnóstico de engenharia](./engineering-assessment.md)  
**Status inicial:** proposto  
**Escala de esforço:** XS (horas), S (até 1 dia), M (2–3 dias), L (4–5 dias), XL (mais de 1 semana). Esforço é uma estimativa relativa e deve ser refinado antes de cada marco.

## Convenções

### Prioridade

- **P0:** risco de segurança, perda de autorização ou funcionalidade principal quebrada; tratar imediatamente.
- **P1:** bloqueia confiabilidade da entrega ou gera regressões frequentes.
- **P2:** melhora capacidade de evolução, operação ou desempenho.
- **P3:** melhoria incremental sem urgência operacional.

### Status

- `Proposto`
- `Pronto`
- `Em andamento`
- `Bloqueado`
- `Concluído`

## Visão priorizada

| Ordem | ID | Item | Prioridade | Esforço | Dependências | Status |
|---:|---|---|---|---|---|---|
| 1 | SEC-001 | Proteger operações i18n | P0 | M | — | Proposto |
| 2 | SEC-002 | Corrigir rotação de refresh token | P0 | M | — | Proposto |
| 3 | SEC-003 | Validar e externalizar secrets | P0 | S | — | Proposto |
| 4 | API-001 | Corrigir contratos frontend/backend | P0 | M | — | Proposto |
| 5 | API-002 | Restaurar submissão pública de contato | P0 | S | — | Proposto |
| 6 | DB-001 | Eliminar drift de migrations | P0 | M | — | Proposto |
| 7 | CI-001 | Implantar CI mínimo | P1 | M | DB-001 | Proposto |
| 8 | TEST-001 | Cobrir jornadas críticas | P1 | L | API-001, API-002, SEC-002 | Proposto |
| 9 | AUTH-001 | Consolidar autenticação Angular | P1 | L | SEC-002, API-001 | Proposto |
| 10 | API-003 | Gerar cliente TypeScript pelo OpenAPI | P1 | L | API-001, CI-001 | Proposto |
| 11 | ARCH-001 | Extrair facades de domínio no Angular | P1 | L | API-003 | Proposto |
| 12 | MAIL-001 | Enfileirar alerta de novo contato | P2 | M | API-002 | Proposto |
| 13 | CACHE-001 | Simplificar cache i18n com versão | P2 | L | SEC-001, TEST-001 | Proposto |
| 14 | OPS-001 | Centralizar configuração tipada | P2 | M | SEC-003 | Proposto |
| 15 | OBS-001 | Padronizar logs e telemetria | P2 | L | OPS-001 | Proposto |
| 16 | TYPE-001 | Remover `any` das fronteiras críticas | P2 | L | API-003, AUTH-001 | Proposto |
| 17 | PERF-001 | Adicionar paginação às listagens | P2 | L | API-003 | Proposto |
| 18 | INFRA-001 | Endurecer imagem e Compose | P2 | M | SEC-003, DB-001 | Proposto |
| 19 | DX-001 | Documentar execução e arquitetura | P3 | M | CI-001, OPS-001 | Proposto |
| 20 | TEST-002 | Definir metas de cobertura por domínio | P3 | S | TEST-001, CI-001 | Proposto |

## Marco 1 — Segurança e funcionalidade básica

### SEC-001 — Proteger operações i18n

**Objetivo:** impedir acesso não autorizado a webhooks, diagnósticos e invalidação de cache.

**Escopo:**

- remover o segredo administrativo literal;
- substituir segredo em query string por autorização adequada;
- validar webhook com assinatura HMAC e proteção contra replay;
- transformar limpeza de cache em operação `POST`;
- restringir ou remover endpoints de diagnóstico em produção;
- não retornar stack traces ao cliente;
- adicionar rate limit específico.

**Critérios de aceite:**

- requisições anônimas recebem `401` ou `403` nos endpoints operacionais;
- webhook com assinatura inválida ou expirada é rejeitado;
- nenhum segredo aparece em URL ou log;
- respostas de erro de produção não incluem stack trace;
- testes automatizados cobrem os casos autorizado e não autorizado.

### SEC-002 — Corrigir rotação de refresh token

**Objetivo:** preservar identidade e papel corretos ao renovar a sessão.

**Escopo:**

- buscar usuário ativo e papel persistido;
- verificar vínculo entre refresh token e usuário;
- manter rotação atômica e detecção de reutilização;
- remover imports e comentários obsoletos;
- usar configuração para tempos de expiração.

**Critérios de aceite:**

- um ADMIN continua ADMIN após refresh;
- token revogado, expirado ou pertencente a outro usuário é rejeitado;
- reutilização revoga a família/sessões conforme regra documentada;
- testes não dependem do relógio real;
- payload JWT possui tipo explícito.

### SEC-003 — Validar e externalizar secrets

**Objetivo:** impedir que a aplicação inicie com credenciais ausentes ou previsíveis.

**Critérios de aceite:**

- não há fallback para secrets JWT no código;
- backend encerra o startup com mensagem segura quando configuração obrigatória falta;
- Compose não contém secrets reais ou conhecidos;
- `.env.example` documenta formato, não valores reutilizáveis;
- logs nunca exibem secrets, nem parcialmente.

### API-001 — Corrigir contratos frontend/backend

**Objetivo:** fazer cadastro e CRUD administrativo usarem as mesmas rotas, métodos e DTOs.

**Escopo mínimo:** cadastro, projetos, tecnologias e contatos.

**Critérios de aceite:**

- cadastro conclui com sucesso pela interface;
- criar, listar, editar e excluir projetos funciona;
- criar, listar, editar e excluir tecnologias funciona;
- listar, marcar como lido e excluir contatos funciona, ou a interface não oferece ações sem endpoint;
- respostas `4xx` são exibidas de forma consistente;
- testes de integração cobrem os contratos corrigidos.

### API-002 — Restaurar submissão pública de contato

**Objetivo:** aceitar contatos legítimos sem exigir login e limitar abuso.

**Critérios de aceite:**

- visitante sem token consegue enviar payload válido;
- payload inválido recebe `400` sem ser persistido;
- endpoint possui throttling específico;
- resposta não revela detalhes do banco ou do provedor de e-mail;
- teste E2E cobre sucesso, validação e rate limit.

### DB-001 — Eliminar drift de migrations

**Objetivo:** garantir que migrations produzam exatamente o schema exigido pela aplicação.

**Escopo:** enum `GUEST`, tabela `experiences`, campos de tecnologia e configuração de `DIRECT_URL`.

**Critérios de aceite:**

- todas as mudanças estão em migrations Prisma versionadas;
- não há migration necessária somente na pasta `manual`;
- banco vazio é criado com `prisma migrate deploy`;
- `prisma validate` e `prisma generate` passam;
- seed completo funciona sobre banco vazio;
- procedimento de rollback/recuperação está documentado.

## Marco 2 — Esteira e prevenção de regressões

### CI-001 — Implantar CI mínimo

**Objetivo:** bloquear integração de código que não compila, não passa nos testes ou possui migrations inválidas.

**Checks obrigatórios:**

- instalação reprodutível com `npm ci` em frontend e backend;
- lint sem `--fix`;
- build de produção do backend;
- build de produção/SSR do frontend;
- testes unitários;
- testes E2E com PostgreSQL e Redis de serviço;
- `prisma validate`, geração do client e migrations em banco descartável;
- cache de dependências por lockfile.

**Critérios de aceite:**

- workflow executa em pull requests e no branch principal;
- falha em qualquer check bloqueia merge;
- `lint` não modifica arquivos;
- pipeline registra resultados de testes e cobertura;
- keep-alive permanece separado da CI.

### TEST-001 — Cobrir jornadas críticas

**Objetivo:** proteger os fluxos de maior risco antes de refactors estruturais.

**Cenários mínimos:**

1. signup → login → acesso autenticado;
2. login ADMIN → refresh → operação administrativa;
3. refresh expirado, revogado e reutilizado;
4. submissão pública de contato;
5. CRUD de projeto e tecnologia;
6. marcação/exclusão de contato;
7. autenticação dos endpoints i18n;
8. cache miss, hit e invalidação.

**Critérios de aceite:** todos os cenários rodam de forma determinística no CI, com isolamento de banco e limpeza de estado.

### AUTH-001 — Consolidar autenticação Angular

**Objetivo:** manter uma única fonte de verdade para sessão, usuário e papel.

**Escopo:**

- unificar `admin_token` e `access_token` em uma estratégia documentada;
- validar/restaurar sessão no startup;
- implementar refresh e logout no backend;
- impedir acesso administrativo quando papel/expiração forem inválidos;
- remover token guest mock do build de produção;
- tratar `401` sem loops de refresh.

**Critérios de aceite:**

- reiniciar a página restaura apenas uma sessão válida;
- token expirado não libera rota administrativa;
- logout revoga refresh tokens e limpa estado local;
- indisponibilidade do backend é apresentada como erro, não como login bem-sucedido;
- testes do guard, interceptor e facade passam.

### API-003 — Gerar cliente TypeScript pelo OpenAPI

**Objetivo:** usar o contrato do backend como fonte dos endpoints e tipos do frontend.

**Critérios de aceite:**

- geração é reprodutível por script;
- CI detecta client desatualizado ou o gera durante o build;
- DTOs e responses principais não são duplicados manualmente;
- componentes não concatenam rotas dos domínios migrados;
- mudanças incompatíveis aparecem no diff do contrato.

## Marco 3 — Arquitetura e operação

### ARCH-001 — Extrair facades de domínio no Angular

**Objetivo:** retirar acesso HTTP e regras de estado dos componentes administrativos.

**Critérios de aceite:**

- projetos, tecnologias, contatos e dashboard usam facades/clientes tipados;
- loading, success e error têm tratamento consistente;
- componentes concentram apresentação e interação;
- subscriptions de longa duração têm teardown explícito ou usam recursos reativos adequados;
- testes unitários exercitam facades sem renderizar páginas completas.

### MAIL-001 — Enfileirar alerta de novo contato

**Objetivo:** desacoplar persistência do contato do provedor de e-mail.

**Critérios de aceite:**

- existe job específico para notificação de contato;
- resposta HTTP não aguarda envio do e-mail;
- processor possui retry, backoff e política de falha;
- job é idempotente;
- conteúdo de mensagem/e-mail não é escrito em log;
- métricas distinguem enfileirado, enviado e falho.

### CACHE-001 — Simplificar cache i18n com versão

**Objetivo:** substituir limpeza por busca de chaves e conexões emergenciais por invalidação versionada.

**Critérios de aceite:**

- chaves incluem versão ativa;
- invalidar cache exige operação O(1), sem `SCAN`;
- não há acesso a detalhes internos do cache-manager;
- não é criada conexão Redis emergencial por requisição;
- comportamento sem Redis está documentado e testado;
- métricas de hit/miss estão disponíveis.

### OPS-001 — Centralizar configuração tipada

**Objetivo:** tornar configuração validada, previsível e fácil de testar.

**Critérios de aceite:**

- domínios de auth, banco, Redis, CORS e mail possuem tipos e validação;
- módulos de negócio não consultam `process.env` diretamente;
- URLs e TTLs não estão duplicados;
- configurações inválidas falham antes de abrir a porta HTTP;
- `.env.example` e Compose estão alinhados ao schema de configuração.

### OBS-001 — Padronizar logs e telemetria

**Objetivo:** permitir diagnóstico sem expor dados sensíveis.

**Critérios de aceite:**

- código do backend usa logger estruturado em vez de `console`;
- secrets, tokens, senhas, corpo de e-mail e dados sensíveis são redigidos;
- requests possuem correlation ID;
- métricas cobrem latência/erros HTTP, banco, Redis e filas;
- logs de produção não usam pretty transport;
- endpoints de health distinguem readiness e liveness.

### TYPE-001 — Remover `any` das fronteiras críticas

**Objetivo:** recuperar segurança estática em autenticação e integrações.

**Critérios de aceite:**

- não há `any` explícito em payload JWT, usuário autenticado ou respostas de auth;
- repositories i18n retornam tipos de domínio;
- metadata de auditoria tem tipo seguro (`unknown`/estrutura validada);
- DTOs administrativos e dashboard são tipados;
- exceções inevitáveis possuem comentário e lint suppression localizada.

### PERF-001 — Adicionar paginação às listagens

**Objetivo:** limitar custo de banco e payload conforme os dados crescem.

**Ordem:** contatos, auditoria, usuários, projetos e tecnologias.

**Critérios de aceite:**

- API adota contrato comum de `items`, página/cursor e total quando necessário;
- limites máximos são impostos no backend;
- queries possuem ordenação determinística e índices coerentes;
- frontend navega e preserva filtros;
- testes cobrem primeira, intermediária, última página e parâmetros inválidos.

### INFRA-001 — Endurecer imagem e Compose

**Objetivo:** aproximar o ambiente empacotado de uma implantação segura e reprodutível.

**Critérios de aceite:**

- imagem final não contém dependências de desenvolvimento desnecessárias;
- processo executa como usuário não-root;
- migrations são uma etapa explícita de deploy;
- Redis e backend possuem healthchecks;
- uploads possuem estratégia persistente documentada;
- secrets são injetados externamente;
- imagem é construída e testada no CI.

## Marco 4 — Sustentabilidade

### DX-001 — Documentar execução e arquitetura

**Objetivo:** substituir conhecimento tácito e READMEs genéricos por documentação do projeto.

**Critérios de aceite:**

- README raiz explica arquitetura, pré-requisitos e quick start;
- frontend e backend documentam scripts reais;
- variáveis obrigatórias, migrations, seeds e troubleshooting estão descritos;
- decisões relevantes possuem ADRs curtos;
- uma pessoa nova consegue executar o sistema seguindo apenas a documentação.

### TEST-002 — Definir metas de cobertura por domínio

**Objetivo:** evoluir cobertura com foco em risco, após as jornadas críticas estarem protegidas.

**Critérios de aceite:**

- baseline de cobertura é publicado no CI;
- cada domínio possui meta incremental acordada;
- cobertura não pode cair em código novo/modificado;
- exclusões são justificadas e revisadas;
- mutation testing é avaliado para auth e autorização.

## Sequência recomendada de entrega

```text
Segurança + contratos + migrations
             ↓
        CI e testes
             ↓
Autenticação e client OpenAPI
             ↓
Facades, configuração e cache
             ↓
Observabilidade, performance e documentação operacional
```

Itens P0 devem ser entregues em PRs pequenos e independentes sempre que possível. Refactors de arquitetura devem começar somente depois que CI e testes críticos estiverem ativos, para reduzir o risco de corrigir e introduzir regressões simultaneamente.
