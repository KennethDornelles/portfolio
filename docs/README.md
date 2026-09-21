# Documentação de engenharia

Este diretório concentra o diagnóstico técnico e o plano de evolução do projeto.

- [Diagnóstico de engenharia](./engineering-assessment.md): riscos, gargalos, evidências e recomendações da análise realizada em 30 de agosto de 2026.
- [Backlog de engenharia](./engineering-backlog.md): itens priorizados, dependências e critérios de aceite.
- [Configuração de ambiente](./configuration.md): variáveis, secrets e fluxo tipado de configuração do backend.
- [Runbook de desenvolvimento e entrega](./development-runbook.md): setup local, banco, validação, R2/CDN e fluxo de deploy.
- [Observabilidade](./observability.md): correlação de requisições e eventos estruturados.
- [Estratégia de testes](./testing-strategy.md): metas de cobertura e critérios de aceite do CI.

## Como manter estes documentos

- Atualize o status dos itens no backlog quando o trabalho começar ou terminar.
- Vincule PRs e issues ao ID do item, por exemplo `SEC-001`.
- Registre novas descobertas no diagnóstico somente quando houver evidência no workspace ou em produção.
- Revise prioridades após a conclusão de cada marco do backlog.

