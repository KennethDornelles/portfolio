# Testando o Health Check Endpoint

## Pré-requisitos

Para testar completamente os endpoints de health check, é necessário:

1. **Banco de dados PostgreSQL rodando** (porta 5432)
   - Você pode usar Docker: `docker-compose up postgres -d`
   
2. **Servidor backend rodando**
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```

## Endpoints Implementados

### 1. Health Check Completo
**Endpoint:** `GET /health`

Verifica:
- ✅ Conectividade com o banco de dados (Prisma)
- ✅ Status da API

**Teste com curl:**
```bash
curl http://localhost:3000/health
```

**Resposta esperada (sucesso):**
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

### 2. Liveness Probe
**Endpoint:** `GET /health/liveness`

Verifica se o aplicativo está rodando. Endpoint simples que sempre responde se o servidor está ativo.

**Teste com curl:**
```bash
curl http://localhost:3000/health/liveness
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-17T19:27:42.000Z"
}
```

### 3. Readiness Probe
**Endpoint:** `GET /health/readiness`

Verifica se o aplicativo está pronto para receber tráfego (verifica conectividade com banco de dados).

**Teste com curl:**
```bash
curl http://localhost:3000/health/readiness
```

**Resposta esperada (sucesso):**
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

## Testes Automatizados

Execute os testes unitários:
```bash
cd backend
npm test -- health.controller.spec.ts
```

## Integração com Docker

O `docker-compose.yml` já está configurado com health checks:

```yaml
services:
  postgres:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U portfolio"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:3000/health/liveness || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    depends_on:
      postgres:
        condition: service_healthy
```

Para verificar o status dos containers:
```bash
docker-compose ps
```

## Testando com Postman/Insomnia

1. **Criar uma coleção** com as seguintes requisições:

   - **Health Check Completo**
     - Method: GET
     - URL: http://localhost:3000/health
   
   - **Liveness**
     - Method: GET
     - URL: http://localhost:3000/health/liveness
   
   - **Readiness**
     - Method: GET
     - URL: http://localhost:3000/health/readiness

## Monitoramento

### Verificando logs do servidor
```bash
# Com Docker
docker-compose logs -f backend

# Localmente
npm run start:dev
```

### Status Codes

- **200 OK**: Todos os checks passaram
- **503 Service Unavailable**: Algum serviço crítico está indisponível

## Troubleshooting

### Erro: "Can't reach database server"
**Solução:**
1. Verifique se o PostgreSQL está rodando:
   ```bash
   docker-compose ps postgres
   # ou
   sudo systemctl status postgresql
   ```

2. Verifique as variáveis de ambiente:
   ```bash
   # No arquivo .env deve ter:
   DATABASE_URL="postgresql://portfolio:portfolio123@localhost:5432/portfolio_db"
   ```

3. Inicie o banco de dados:
   ```bash
   docker-compose up postgres -d
   ```

### Erro: "Cannot GET /health"
**Solução:**
1. Verifique se o servidor está rodando na porta correta
2. Certifique-se de que o HealthModule está importado no AppModule
3. Limpe e reconstrua o projeto:
   ```bash
   rm -rf dist/
   npm run build
   npm run start:prod
   ```

## Próximos Passos

- [ ] Adicionar métricas de performance (tempo de resposta)
- [ ] Integrar com serviços de monitoramento (Prometheus, Grafana)
- [ ] Adicionar health checks para serviços externos (APIs, cache, etc.)
- [ ] Implementar alertas automáticos
