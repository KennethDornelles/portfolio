# Auditoria estática do Portfolio

O comando `npm run audit:any` (executado em `backend`) percorre o repositório a
partir da raiz detectada pelo próprio script. Ele não acessa banco, Redis ou
serviços externos e não modifica arquivos.

## Uso

```bash
cd backend
npm run audit:any
npm run audit:any -- --json
npm run audit:any -- --json reports/audit.json
```

O modo padrão imprime evidências com severidade, check, arquivo e linha. O modo
JSON produz um relatório com `root`, `filesScanned`, `counts` e `findings`.

## Checks

- `typescript-no-any`: localiza `any` via TypeScript Compiler API em fontes
  backend/frontend, excluindo testes, declarações e artefatos gerados;
- `secret-fallback` e `secret-log`: detectam fallbacks literais ou possível
  registro de secrets obrigatórios;
- `compose-*`: verifica Compose, Redis e ausência de fallback de senha do banco;
- `prisma-*`: verifica schema e migrations versionadas;
- `i18n-empty-cache`: sinaliza persistência literal de mapa vazio;
- `ssr-browser-global`: alerta sobre APIs de navegador em código Angular;
- `ci-workflow`: alerta se o workflow CI não existir.

Checks de severidade `error` produzem exit code 1; avisos não bloqueiam a
execução. O script não imprime valores de variáveis de ambiente, corpos de
requisições ou credenciais.
