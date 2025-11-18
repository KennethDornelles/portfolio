# 🐳 Docker Guide - Portfolio

## 📋 Conteúdo

- [Estrutura de Contêineres](#estrutura-de-contêineres)
- [Ambientes](#ambientes)
- [Comandos Rápidos](#comandos-rápidos)
- [Otimizações Implementadas](#otimizações-implementadas)

## 🏗️ Estrutura de Contêineres

### Services

1. **PostgreSQL** - Banco de dados
   - Imagem: `postgres:16-alpine`
   - Porta: `5432`
   - Volume persistente para dados

2. **Backend (NestJS)**
   - Multi-stage build otimizado
   - Porta: `3000`
   - Health checks integrados

3. **Frontend (Angular)**
   - Build otimizado com Nginx
   - Porta: `4200` (dev) / `80` (prod)
   - Compressão Gzip e cache de assets

## 🌍 Ambientes

### Produção

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down

# Rebuild e restart
docker-compose up -d --build
```

### Desenvolvimento (com hot-reload)

```bash
# Usar arquivo de desenvolvimento
docker-compose -f docker-compose.dev.yml up -d

# Ver logs em tempo real
docker-compose -f docker-compose.dev.yml logs -f backend

# Parar ambiente de dev
docker-compose -f docker-compose.dev.yml down
```

## ⚡ Comandos Rápidos

### Build

```bash
# Build sem cache (rebuild completo)
docker-compose build --no-cache

# Build apenas um serviço
docker-compose build backend
```

### Executar Migrations

```bash
# Dentro do container do backend
docker-compose exec backend npm run prisma:migrate:deploy

# Ou com docker-compose.dev.yml
docker-compose -f docker-compose.dev.yml exec backend npm run prisma:migrate
```

### Prisma Studio

```bash
docker-compose exec backend npm run prisma:studio
```

### Acessar Shell dos Containers

```bash
# Backend
docker-compose exec backend sh

# PostgreSQL
docker-compose exec postgres psql -U portfolio -d portfolio_db

# Frontend (Nginx)
docker-compose exec frontend sh
```

### Limpeza

```bash
# Remover containers, networks e volumes
docker-compose down -v

# Limpar imagens não utilizadas
docker image prune -a

# Limpar tudo (cuidado!)
docker system prune -a --volumes
```

## 🚀 Otimizações Implementadas

### 1. Multi-Stage Build

**Backend:**
- **Stage 1 (dependencies)**: Instala todas as dependências
- **Stage 2 (build)**: Compila o TypeScript e gera Prisma Client
- **Stage 3 (production)**: Imagem final com apenas produção

**Frontend:**
- **Stage 1 (dependencies)**: Instala dependências
- **Stage 2 (build)**: Build do Angular
- **Stage 3 (production)**: Nginx servindo arquivos estáticos

### 2. Camadas de Cache Docker

```dockerfile
# Copia package.json primeiro (camada cacheável)
COPY package*.json ./
RUN npm ci

# Depois copia código fonte (muda com frequência)
COPY . .
```

### 3. .dockerignore

Exclui arquivos desnecessários do contexto Docker:
- `node_modules`
- Arquivos de teste
- Documentação
- Configurações de IDE

### 4. Segurança

- ✅ Usuário não-root nos containers
- ✅ Imagens Alpine (menor superfície de ataque)
- ✅ Health checks implementados
- ✅ Security headers no Nginx

### 5. Performance

- ✅ `npm ci` ao invés de `npm install` (builds reproduzíveis)
- ✅ `npm prune --production` (remove devDependencies)
- ✅ Compressão Gzip no Nginx
- ✅ Cache de assets estáticos (1 ano)
- ✅ Apenas dependências de produção na imagem final

### 6. Health Checks

**Backend:**
```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health/liveness || exit 1
```

**Frontend:**
```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80 || exit 1
```

**PostgreSQL:**
```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U portfolio"]
  interval: 10s
  timeout: 5s
  retries: 5
```

### 7. Tamanho das Imagens

Otimizado através de:
- Uso de imagens Alpine Linux
- Multi-stage builds
- Remoção de devDependencies
- .dockerignore eficiente

**Estimativa de tamanho:**
- Backend: ~150-200 MB
- Frontend: ~25-35 MB (Nginx + assets)
- PostgreSQL: ~230 MB

### 8. Desenvolvimento vs Produção

**Produção:**
- Imagens otimizadas e enxutas
- Sem volumes de código-fonte
- Health checks ativos
- Restart automático

**Desenvolvimento:**
- Hot-reload ativo
- Volumes mapeados para código
- Debug port exposto (9229)
- Logs verbosos

## 📝 Variáveis de Ambiente

Copie `.env.example` para `.env` e ajuste:

```bash
cp .env.example .env
```

```env
# Database
POSTGRES_USER=portfolio
POSTGRES_PASSWORD=seu-senha-segura
POSTGRES_DB=portfolio_db

# Backend
DATABASE_URL=postgresql://...
JWT_SECRET=sua-chave-jwt-super-secreta
PORT=3000

# Environment
NODE_ENV=production
```

## 🔍 Monitoramento

### Ver uso de recursos

```bash
docker stats
```

### Inspecionar containers

```bash
docker-compose ps
docker inspect portfolio_backend
```

### Logs estruturados

```bash
# Últimas 100 linhas
docker-compose logs --tail=100 backend

# Tempo real com timestamp
docker-compose logs -f --timestamps backend
```

## 🛠️ Troubleshooting

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs backend

# Verificar health check
docker inspect --format='{{json .State.Health}}' portfolio_backend | jq
```

### Rebuild sem cache

```bash
docker-compose build --no-cache backend
docker-compose up -d backend
```

### Problemas com Prisma

```bash
# Regenerar Prisma Client
docker-compose exec backend npm run prisma:generate

# Reset database (⚠️ CUIDADO)
docker-compose exec backend npm run prisma:migrate:reset
```

### Porta já em uso

```bash
# Verificar portas em uso
netstat -ano | findstr :3000
netstat -ano | findstr :5432

# Parar processo ou mudar porta no docker-compose.yml
```

## 📚 Recursos

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Multi-stage builds](https://docs.docker.com/build/building/multi-stage/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Nginx Optimization](https://nginx.org/en/docs/)
