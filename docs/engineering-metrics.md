# Métricas de engenharia verificáveis

## Princípios

As métricas deste documento são obtidas exclusivamente do repositório e das execuções de CI. Não representam tráfego, usuários, conversões ou desempenho de produção.

## Controles medidos pelo CI

O workflow [CI](../.github/workflows/ci.yml) executa, em cada pull request e em toda atualização da `main`:

- backend: validação e geração Prisma, migrations, seed, lint, testes unitários com cobertura, testes E2E e build;
- frontend: testes unitários com cobertura e build de produção.

Os relatórios de cobertura são publicados como os artefatos `backend-coverage` e `frontend-coverage` em cada execução. O resumo de cobertura é calculado pelos próprios runners, evitando números fixos e desatualizados no repositório.

## Inventário inicial

Baseline extraído em 20 de setembro de 2026, a partir do checkout local:

| Métrica | Valor | Fonte de verificação |
| --- | ---: | --- |
| Suites de teste do backend | 14 | Arquivos `*.spec.ts` e `*.e2e-spec.ts` em `backend` |
| Suites de teste do frontend | 9 | Arquivos `*.spec.ts` em `frontend/src` |
| Workflows versionados | 2 | Arquivos YAML em `.github/workflows` |
| Commits no histórico local | 141 | `git rev-list --count HEAD` |
| Autores no histórico local | 3 | `git shortlog -sne HEAD` |

## Cobertura inicial

Executada em 20 de setembro de 2026 com os comandos documentados abaixo:

| Escopo | Suites | Testes | Statements | Branches | Funções | Linhas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Backend unitário | 12 | 65 | 42,81% | 35,94% | 31,11% | 43,30% |
| Frontend unitário | 9 | 35 | 86,23% | 80,82% | 81,48% | 90,09% |

Os dois testes E2E do backend são executados em uma etapa própria do CI e não entram neste percentual unitário.

## Reprodução local

Execute os comandos a seguir no diretório indicado. As saídas dos testes geram os relatórios de cobertura usados pelo CI.

```powershell
cd backend
npm run test:cov:ci

cd ../frontend
npm run test:coverage
```

Para atualizar o inventário estrutural:

```powershell
(rg --files backend -g '*.spec.ts' -g '*.e2e-spec.ts').Count
(rg --files frontend/src -g '*.spec.ts').Count
(rg --files .github/workflows -g '*.yml' -g '*.yaml').Count
git rev-list --count HEAD
git shortlog -sne HEAD
```

## Leitura dos resultados

Cobertura é um indicador de alcance, não uma garantia de qualidade. Antes de definir metas percentuais, avalie os relatórios por módulo e priorize jornadas de autenticação, contatos, i18n e CRUD administrativo. O item `TEST-002` define metas de cobertura por domínio.
