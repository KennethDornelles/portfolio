# Backlog de Engenharia — OluStack Portfolio

> Backlog priorizado do projeto, consolidado a partir da auditoria técnica e das análises comparativas de portfólios.  
> Última sincronização documental: 2 de setembro de 2026.  
> Fonte de acompanhamento operacional: backlog do projeto no Notion.

## Objetivo

Este documento mantém no repositório uma visão versionável das iniciativas de segurança, contratos de API, autenticação, testes, infraestrutura, arquitetura, conteúdo e experiência do portfólio.

O Notion continua sendo a fonte operacional para planejamento e atualização de status. Este arquivo deve ser atualizado sempre que houver alteração relevante de escopo, dependência, prioridade, esforço, marco ou estado.

## Convenções

### Prioridade

| Código | Significado |
| --- | --- |
| P0 | Crítico: bloqueia segurança, integridade ou funcionamento essencial |
| P1 | Alto: necessário para estabilização e evolução estrutural |
| P2 | Médio: melhoria importante de qualidade, arquitetura ou posicionamento |
| P3 | Evolutivo: aprimoramento incremental ou otimização |

### Esforço

| Código | Referência |
| --- | --- |
| XS | Alteração pequena e localizada |
| S | Alteração pequena, com validação específica |
| M | Implementação moderada, envolvendo mais de um componente |
| L | Mudança ampla, arquitetural ou com várias integrações |

### Status

| Status | Significado |
| --- | --- |
| Proposto | Item identificado, ainda não selecionado para execução |
| Pronto | Refinado e apto a entrar em uma Sprint |
| Em andamento | Implementação iniciada |
| Bloqueado | Execução impedida por dependência ou fator externo |
| Concluído | Implementado e validado |

## Visão geral

| Indicador | Quantidade |
| --- | ---: |
| Total de itens | 37 |
| Concluídos | 9 |
| Propostos | 28 |
| P0 | 6 |
| P1 | 5 |
| P2 | 18 |
| P3 | 8 |
| Marco 1 | 6 |
| Marco 2 | 4 |
| Marco 3 | 8 |
| Marco 4 | 19 |

## Marco 1 — Correções críticas

| Código | Item | Dependências | Esforço | Prioridade | Status |
| --- | --- | --- | :---: | :---: | --- |
| API-001 | Corrigir contratos frontend/backend | — | M | P0 | Concluído |
| API-002 | Restaurar submissão pública de contato | — | S | P0 | Concluído |
| DB-001 | Eliminar drift de migrations | — | M | P0 | Concluído |
| SEC-001 | Proteger operações i18n | — | M | P0 | Concluído |
| SEC-002 | Corrigir rotação de refresh token | — | M | P0 | Concluído |
| SEC-003 | Validar e externalizar secrets | — | S | P0 | Concluído |

## Marco 2 — Contratos, autenticação e testes críticos

| Código | Item | Dependências | Esforço | Prioridade | Status |
| --- | --- | --- | :---: | :---: | --- |
| API-003 | Gerar cliente TypeScript pelo OpenAPI | API-001, CI-001 | L | P1 | Concluído |
| AUTH-001 | Consolidar autenticação Angular | SEC-002, API-001 | L | P1 | Concluído |
| CI-001 | Implantar CI mínimo | DB-001 | M | P1 | Concluído |
| TEST-001 | Cobrir jornadas críticas | API-001, API-002, SEC-002 | L | P1 | Concluído |

## Marco 3 — Arquitetura e operação

| Código | Item | Dependências | Esforço | Prioridade | Status |
| --- | --- | --- | :---: | :---: | --- |
| ARCH-001 | Extrair facades de domínio no Angular | API-003 | L | P1 | Proposto |
| CACHE-001 | Simplificar cache i18n com versão | SEC-001, TEST-001 | L | P2 | Proposto |
| INFRA-001 | Endurecer imagem e Compose | SEC-003, DB-001 | M | P2 | Proposto |
| MAIL-001 | Enfileirar alerta de novo contato | API-002 | M | P2 | Proposto |
| OBS-001 | Padronizar logs e telemetria | OPS-001 | L | P2 | Proposto |
| OPS-001 | Centralizar configuração tipada | SEC-003 | M | P2 | Proposto |
| PERF-001 | Adicionar paginação às listagens | API-003 | L | P2 | Proposto |
| TYPE-001 | Remover `any` das fronteiras críticas | API-003, AUTH-001 | L | P2 | Proposto |

## Marco 4 — Portfólio, conteúdo e qualidade evolutiva

| Código | Item | Dependências | Esforço | Prioridade | Status |
| --- | --- | --- | :---: | :---: | --- |
| A11Y-001 | Revisar tema, teclado, contraste e movimento reduzido | CONTENT-001, CONTENT-002 | M | P2 | Proposto |
| CASE-001 | Criar template de case study | — | M | P2 | Proposto |
| CASE-002 | Publicar ExploraJP como case study principal | CASE-001 | M | P2 | Proposto |
| CONTENT-001 | Reposicionar hero para Backend/Fullstack | — | XS | P2 | Proposto |
| CONTENT-002 | Reestruturar cards com impacto e CTA | CASE-001 | S | P2 | Proposto |
| CONTENT-004 | Quantificar resultados técnicos das experiências | CONTENT-003 | S | P2 | Proposto |
| CV-001 | Disponibilizar CV em PT-BR e EN-US | CONTENT-001 | S | P2 | Proposto |
| EXP-001 | Criar linha do tempo de experiência orientada a impacto | CONTENT-003, CONTENT-004 | M | P2 | Proposto |
| I18N-002 | Preservar rota, metadata e `hreflang` na troca PT/EN | CACHE-001 | M | P2 | Proposto |
| METRICS-001 | Extrair métricas verificáveis do repositório e CI | CI-001 | M | P2 | Proposto |
| SEO-001 | Implementar metadata, canonical e dados estruturados multilíngues | I18N-002 | M | P2 | Proposto |
| ANALYTICS-001 | Instrumentar conversões dos CTAs | CONTENT-001, CONTENT-002, CV-001 | S | P3 | Proposto |
| CONTACT-002 | Disponibilizar contatos secundários com proteção contra spam | API-002, SEC-001 | S | P3 | Proposto |
| CONTENT-003 | Reescrever página Sobre por resultados | CONTENT-001 | S | P3 | Proposto |
| DX-001 | Documentar execução e arquitetura | CI-001, OPS-001 | M | P3 | Proposto |
| FILTER-001 | Adicionar filtros de projetos por categoria | CASE-002, CONTENT-002 | S | P3 | Proposto |
| MEDIA-001 | Incorporar vídeo demonstrativo do ExploraJP | CASE-002 | S | P3 | Proposto |
| PREVIEW-001 | Criar componente de demonstração interativa sob demanda | CASE-001, MEDIA-001 | M | P3 | Proposto |
| TEST-002 | Definir metas de cobertura por domínio | TEST-001, CI-001 | S | P3 | Proposto |

## Encadeamentos principais

### Estabilização técnica

1. API-003 — cliente TypeScript gerado pelo OpenAPI.
2. ARCH-001 — facades de domínio no Angular.
3. TYPE-001 — remoção de `any` nas fronteiras críticas.
4. PERF-001 — paginação das listagens.

### Internacionalização e SEO

1. CACHE-001 — cache i18n versionado.
2. I18N-002 — preservação de rota, metadata e `hreflang`.
3. SEO-001 — metadata, canonical e dados estruturados multilíngues.

### Narrativa e apresentação do portfólio

1. CONTENT-001 — posicionamento do hero.
2. CASE-001 — template de case study.
3. CONTENT-002 — cards orientados a impacto.
4. CASE-002 — case study do ExploraJP.
5. MEDIA-001 — vídeo demonstrativo.
6. PREVIEW-001 — demonstração interativa sob demanda.

### Experiência profissional baseada em evidências

1. CONTENT-003 — página Sobre orientada a resultados.
2. METRICS-001 — levantamento de métricas verificáveis.
3. CONTENT-004 — quantificação das experiências.
4. EXP-001 — linha do tempo orientada a impacto.

## Corte sugerido para a próxima Sprint

Este corte é uma recomendação para refinamento; os itens permanecem oficialmente como `Proposto` até o Sprint Planning.

| Ordem | Código | Motivo |
| ---: | --- | --- |
| 1 | CONTENT-001 | Mudança pequena que define o posicionamento de toda a comunicação |
| 2 | CASE-001 | Cria a estrutura reutilizável para projetos de maior profundidade |
| 3 | CONTENT-003 | Prepara a narrativa profissional baseada em resultados |
| 4 | METRICS-001 | Garante que números publicados sejam verificáveis |
| 5 | CONTENT-002 | Evolui os cards utilizando a estrutura do case study |

### Critério para entrada na Sprint

Antes de mover um item de `Proposto` para `Pronto`, confirmar:

- descrição e objetivo compreensíveis;
- critérios de aceite verificáveis;
- dependências concluídas ou incluídas no mesmo planejamento;
- estratégia de testes definida;
- ausência de credenciais, dados pessoais ou segredos na documentação;
- esforço compatível com a capacidade da Sprint.

## Política de atualização

Ao modificar o backlog operacional:

1. atualizar o item no Notion;
2. refletir a mudança neste arquivo;
3. registrar a alteração no histórico do Git;
4. não marcar como concluído sem evidência de validação;
5. manter códigos estáveis, mesmo quando o título for refinado.
