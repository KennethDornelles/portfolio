# Backend Documentation

## 📋 Guia de Migração - Portfólio React para Angular 19+ Stack

### 🎯 Objetivo
Migrar o portfólio atual em React (https://react-portfolio-ten-gules.vercel.app) para uma stack moderna fullstack com:
- **Frontend**: Angular 19+ com Standalone Components
- **Backend**: NestJS com TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Containerização**: Docker & Docker Compose

> **📝 Nota:** Este guia contém apenas instruções passo a passo. Você criará os arquivos manualmente conforme as instruções.

---

### 📊 Análise do Portfólio Atual

#### Seções Identificadas:
1. **Hero** - Apresentação inicial com nome e título
2. **Sobre Mim** - Informações pessoais e biografia
3. **Serviços** - Cards de serviços oferecidos
4. **Projetos/Portfólio** - Galeria de projetos
5. **Educação & Skills** - Formação e habilidades técnicas
6. **Exemplos de Código** - Code snippets
7. **Currículo** - Experiências profissionais
8. **Depoimentos** - Feedback de clientes
9. **Contato** - Formulário e informações de contato

---

### 🗂️ Estrutura do Projeto

```
portfolio-fullstack/
├── frontend/                    # Angular 19+ Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/           # Serviços singleton, guards, interceptors
│   │   │   ├── shared/         # Componentes, pipes, directives compartilhados
│   │   │   ├── features/       # Módulos de funcionalidades
│   │   │   │   ├── home/
│   │   │   │   ├── about/
│   │   │   │   ├── services/
│   │   │   │   ├── projects/
│   │   │   │   ├── skills/
│   │   │   │   ├── resume/
│   │   │   │   ├── testimonials/
│   │   │   │   └── contact/
│   │   │   ├── layouts/        # Layouts da aplicação
│   │   │   └── app.config.ts
│   │   ├── assets/
│   │   ├── environments/
│   │   └── styles/
│   ├── angular.json
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── backend/                     # NestJS Application
│   ├── src/
│   │   ├── modules/
│   │   │   ├── projects/
│   │   │   ├── services/
│   │   │   ├── skills/
│   │   │   ├── experiences/
│   │   │   ├── education/
│   │   │   ├── testimonials/
│   │   │   └── contact/
│   │   ├── prisma/
│   │   ├── common/
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

### 🚀 Passo a Passo da Migração

#### **FASE 1: Configuração do Ambiente** ⚙️

##### 1.1 Instalar Ferramentas Necessárias
```bash
# Verificar versões
node --version  # v20+ recomendado
npm --version   # v10+ recomendado

# Instalar Angular CLI globalmente
npm install -g @angular/cli@19

# Instalar NestJS CLI (se ainda não tiver)
npm install -g @nestjs/cli

# Verificar Docker
docker --version
docker-compose --version
```

##### 1.2 Criar Estrutura de Pastas
```bash
# Na raiz do projeto portfolio-fullstack
mkdir -p frontend backend/prisma
```

---

#### **FASE 2: Configuração do Backend NestJS** 🔧

##### 2.1 Configurar Prisma no Backend
```bash
cd backend

# Instalar dependências do Prisma
npm install @prisma/client
npm install -D prisma

# Inicializar Prisma (já feito se existir)
npx prisma init
```

##### 2.2 Configurar Schema do Prisma
Editar `backend/prisma/schema.prisma` com o modelo de dados do portfólio.

##### 2.3 Instalar Dependências Adicionais
```bash
npm install @nestjs/config
npm install @nestjs/swagger
npm install class-validator class-transformer
npm install @nestjs/throttler
npm install helmet
npm install compression
```

##### 2.4 Criar Módulos do NestJS
```bash
# Gerar módulos
nest g resource modules/projects --no-spec
nest g resource modules/skills --no-spec
nest g resource modules/experiences --no-spec
nest g resource modules/education --no-spec
nest g resource modules/testimonials --no-spec
nest g resource modules/contact --no-spec
nest g resource modules/services --no-spec

# Gerar módulo do Prisma
nest g module prisma --no-spec
nest g service prisma/prisma --no-spec --flat
```

##### 2.5 Configurar Variáveis de Ambiente
Criar `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/portfolio_db?schema=public"
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:4200
```

---

### **FASE 4: Configuração do Banco de Dados** 🗄️

#### 4.1 Configurar PostgreSQL com Docker
Criar `docker-compose.yml` na raiz:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: portfolio-db
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: portfolio_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

#### 4.2 Iniciar Banco de Dados
```bash
# Subir o PostgreSQL
docker-compose up -d postgres

# Verificar se está rodando
docker-compose ps
```

#### 4.3 Executar Migrations do Prisma
```bash
cd backend

# Criar migration inicial
npx prisma migrate dev --name init

# Gerar Prisma Client
npx prisma generate

# (Opcional) Popular banco com dados iniciais
npx prisma db seed
```

---

### **FASE 5: Implementação das Features** 💻

#### 5.1 Implementar Backend - Ordem Recomendada

1. **Prisma Service** (configuração base)
2. **Skills Module** (mais simples)
3. **Services Module** (serviços oferecidos)
4. **Projects Module** (projetos do portfólio)
5. **Education Module** (formação acadêmica)
6. **Experiences Module** (experiências profissionais)
7. **Testimonials Module** (depoimentos)
8. **Contact Module** (formulário de contato)

---

### **FASE 6: Dockerização Completa** 🐳

#### 6.1 Criar Dockerfile do Backend
Criar `backend/Dockerfile`:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
```

---

### **FASE 7: Testes e Validações** ✅

#### 7.1 Testes do Backend
```bash
cd backend

# Executar testes unitários
npm run test

# Executar testes e2e
npm run test:e2e

# Coverage
npm run test:cov
```

---

## Testando o Health Check Endpoint

### Pré-requisitos

Para testar completamente os endpoints de health check, é necessário:

1. **Banco de dados PostgreSQL rodando** (porta 5432)
   - Você pode usar Docker: `docker-compose up postgres -d`
   
2. **Servidor backend rodando**
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```

### Endpoints Implementados

#### 1. Health Check Completo
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

#### 2. Liveness Probe
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

#### 3. Readiness Probe
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

### Testes Automatizados

Execute os testes unitários:
```bash
cd backend
npm test -- health.controller.spec.ts
```

### Integração com Docker

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

### Testando com Postman/Insomnia

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

### Monitoramento

#### Verificando logs do servidor
```bash
# Com Docker
docker-compose logs -f backend

# Localmente
npm run start:dev
```

#### Status Codes

- **200 OK**: Todos os checks passaram
- **503 Service Unavailable**: Algum serviço crítico está indisponível

### Troubleshooting

#### Erro: "Can't reach database server"
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

#### Erro: "Cannot GET /health"
**Solução:**
1. Verifique se o servidor está rodando na porta correta
2. Certifique-se de que o HealthModule está importado no AppModule
3. Limpe e reconstrua o projeto:
   ```bash
   rm -rf dist/
   npm run build
   npm run start:prod
   ```
