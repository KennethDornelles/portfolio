# Estratégia de testes (TEST-002)

## Portões de qualidade

Todo PR deve executar lint, build e testes da camada alterada. O CI publica os relatórios de cobertura do backend e frontend como artefatos.

Metas progressivas para o projeto:

| Camada | Linha inicial | Meta | Prioridade |
| --- | ---: | ---: | --- |
| Backend unitário | 60% | 75% | alta |
| Backend controllers/services críticos | 70% | 85% | alta |
| Frontend services/facades | 50% | 75% | média |
| Frontend componentes de conversão | 40% | 70% | alta |
| Fluxos e2e críticos | smoke | 100% dos fluxos | alta |

As metas são incrementais: um PR não deve reduzir a cobertura existente da área alterada. Quando a cobertura estiver estabilizada, os limites devem ser convertidos em thresholds no runner do respectivo projeto.

## Comandos locais

```powershell
npm --prefix backend run lint
npm --prefix backend run test:cov:ci
npm --prefix frontend run build
npm --prefix frontend run test:coverage
```

Para mudanças de banco ou autenticação, execute também `npm --prefix backend run test:e2e` com as variáveis do ambiente de teste.

## Critérios de aceite

- testes determinísticos e isolados, sem depender de produção;
- mocks para Redis, e-mail, storage e APIs externas;
- nenhum segredo ou dado pessoal em snapshots/logs;
- novo comportamento de conversão coberto por teste unitário ou smoke test;
- relatório de cobertura anexado ao CI quando aplicável.
