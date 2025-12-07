# Health Check Module

Este módulo fornece endpoints para verificar o status de saúde da aplicação.

## Endpoints

### GET /health

Verifica o status geral da aplicação, incluindo:
- Conectividade com o banco de dados
- Status da API

**Resposta de Sucesso (200 OK):**
```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    },
    "api": {
      "status": "up"
    }
  },
  "error": {},
  "details": {
    "database": {
      "status": "up"
    },
    "api": {
      "status": "up"
    }
  }
}
```

**Resposta de Erro (503 Service Unavailable):**
```json
{
  "status": "error",
  "info": {},
  "error": {
    "database": {
      "status": "down",
      "message": "Connection timeout"
    }
  },
  "details": {
    "database": {
      "status": "down",
      "message": "Connection timeout"
    },
    "api": {
      "status": "up"
    }
  }
}
```

### GET /health/liveness

Verifica se a aplicação está rodando (probe de vitalidade).
Este endpoint é útil para Kubernetes liveness probes.

**Resposta (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2025-11-17T12:00:00.000Z"
}
```

### GET /health/readiness

Verifica se a aplicação está pronta para receber tráfego (probe de prontidão).
Este endpoint verifica a conectividade com o banco de dados.
Útil para Kubernetes readiness probes.

**Resposta de Sucesso (200 OK):**
```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    }
  },
  "error": {},
  "details": {
    "database": {
      "status": "up"
    }
  }
}
```

## Uso com Kubernetes

### Liveness Probe
```yaml
livenessProbe:
  httpGet:
    path: /health/liveness
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3
```

### Readiness Probe
```yaml
readinessProbe:
  httpGet:
    path: /health/readiness
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3
```

## Uso com Docker Compose

```yaml
services:
  backend:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

## Dependências

- `@nestjs/terminus`: Framework de health checks do NestJS
- `@nestjs/axios`: Cliente HTTP para verificar endpoints
- `axios`: Cliente HTTP

## Indicadores de Saúde

### Database (Prisma)
Verifica a conectividade com o banco de dados PostgreSQL usando o Prisma.

### API
Verifica se a API está respondendo corretamente fazendo uma requisição HTTP para si mesma.

## Testes

Execute os testes unitários:
```bash
npm test -- health.controller.spec.ts
```
