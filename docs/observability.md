# Observabilidade da API

## Correlação de requisições

Toda requisição recebe um identificador `X-Request-Id`. Se o cliente enviar um valor válido (até 128 caracteres), ele é preservado; caso contrário, a API gera um UUID. O mesmo valor é devolvido no response header e incluído nos logs.

## Eventos estruturados

O logger Pino registra os eventos abaixo em JSON:

- `http.request.completed`: método, URL, status HTTP, duração em milissegundos e `requestId`.
- `mail.job.started`: início de um job BullMQ, nome, id e tentativa.
- `mail.job.completed`: conclusão do envio, sem registrar destinatário, assunto ou corpo.
- `mail.job.unknown`: job não reconhecido.

Campos sensíveis (credenciais, cookies, tokens e senhas) são mascarados na configuração do Pino. Dados de e-mail não são gravados nos eventos de fila.

## Diagnóstico

Para correlacionar uma chamada, envie um identificador próprio:

```bash
curl -i -H "X-Request-Id: suporte-2026-09-21-001" http://localhost:3000/api/health
```

Em produção, filtre os logs por `requestId` ou `event`. O campo `durationMs` permite acompanhar latência sem depender de mensagens de texto não estruturadas.
