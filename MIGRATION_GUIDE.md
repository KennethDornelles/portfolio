# 📋 Guia de Migração - Portfólio React para Angular 19+ Stack

## 🎯 Objetivo
Migrar o portfólio atual em React (https://react-portfolio-ten-gules.vercel.app) para uma stack moderna fullstack com:
- **Frontend**: Angular 19+ com Standalone Components
- **Backend**: NestJS com TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Containerização**: Docker & Docker Compose

> **📝 Nota:** Este guia contém apenas instruções passo a passo. Você criará os arquivos manualmente conforme as instruções.

---

## 📊 Análise do Portfólio Atual

### Seções Identificadas:
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

## 🗂️ Estrutura do Projeto

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

## 🚀 Passo a Passo da Migração

### **FASE 1: Configuração do Ambiente** ⚙️

#### 1.1 Instalar Ferramentas Necessárias
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

#### 1.2 Criar Estrutura de Pastas
```bash
# Na raiz do projeto portfolio-fullstack
mkdir -p frontend backend/prisma
```

---

### **FASE 2: Configuração do Backend NestJS** 🔧

#### 2.1 Configurar Prisma no Backend
```bash
cd backend

# Instalar dependências do Prisma
npm install @prisma/client
npm install -D prisma

# Inicializar Prisma (já feito se existir)
npx prisma init
```

#### 2.2 Configurar Schema do Prisma
Editar `backend/prisma/schema.prisma` com o modelo de dados do portfólio.

#### 2.3 Instalar Dependências Adicionais
```bash
npm install @nestjs/config
npm install @nestjs/swagger
npm install class-validator class-transformer
npm install @nestjs/throttler
npm install helmet
npm install compression
```

#### 2.4 Criar Módulos do NestJS
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

#### 2.5 Configurar Variáveis de Ambiente
Criar `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/portfolio_db?schema=public"
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:4200
```

---

### **FASE 3: Configuração do Frontend Angular** 🎨

#### 3.1 Criar Projeto Angular
```bash
cd ..
ng new frontend --routing --style=scss --standalone
# Escolher: Yes para routing, SCSS para estilos
```

#### 3.2 Instalar Dependências do Frontend
```bash
cd frontend

# Instalar Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init

# Instalar bibliotecas úteis
npm install @angular/animations
npm install lucide-angular  # Ícones modernos
npm install ngx-scrollreveal  # Animações no scroll
npm install swiper  # Carrossel de imagens
npm install @angular/forms
```

#### 3.3 Configurar Tailwind CSS
Editar `frontend/tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
      }
    },
  },
  plugins: [],
}
```

Editar `frontend/src/styles.scss`:
```scss
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### 3.4 Criar Estrutura de Componentes
```bash
# Core
ng g service core/services/api --skip-tests
ng g service core/services/seo --skip-tests
ng g interceptor core/interceptors/http-error --skip-tests

# Shared Components
ng g c shared/components/navbar --standalone --skip-tests
ng g c shared/components/footer --standalone --skip-tests
ng g c shared/components/loading --standalone --skip-tests
ng g c shared/components/button --standalone --skip-tests
ng g c shared/components/card --standalone --skip-tests

# Feature Components
ng g c features/home --standalone --skip-tests
ng g c features/about --standalone --skip-tests
ng g c features/services --standalone --skip-tests
ng g c features/projects --standalone --skip-tests
ng g c features/skills --standalone --skip-tests
ng g c features/resume --standalone --skip-tests
ng g c features/testimonials --standalone --skip-tests
ng g c features/contact --standalone --skip-tests
```

#### 3.5 Configurar Environments
Editar `frontend/src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

Editar `frontend/src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.seudominio.com/api'
};
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

#### 5.2 Implementar Frontend - Ordem Recomendada

1. **Navbar & Footer** (estrutura base)
2. **Home Component** (hero section)
3. **About Component** (sobre mim)
4. **Services Component** (serviços)
5. **Skills Component** (habilidades)
6. **Projects Component** (portfólio)
7. **Resume Component** (currículo)
8. **Testimonials Component** (depoimentos)
9. **Contact Component** (formulário)

#### 5.3 Integração Frontend-Backend

Para cada feature:
1. Criar interface TypeScript dos dados
2. Criar service Angular para API calls
3. Implementar componente com dados da API
4. Adicionar loading states e error handling
5. Implementar animações e transições

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

#### 6.2 Criar Dockerfile do Frontend
Criar `frontend/Dockerfile`:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

FROM nginx:alpine
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 6.3 Atualizar docker-compose.yml
Adicionar serviços completos ao `docker-compose.yml`.

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

#### 7.2 Testes do Frontend
```bash
cd frontend

# Executar testes
ng test

# Executar testes e2e (se configurado)
ng e2e

# Build de produção
ng build --configuration production
```

#### 7.3 Validação Docker
```bash
# Build das imagens
docker-compose build

# Subir todos os serviços
docker-compose up -d

# Verificar logs
docker-compose logs -f

# Testar acesso
# Frontend: http://localhost:4200
# Backend: http://localhost:3000/api
# Swagger: http://localhost:3000/api/docs
```

---

### **FASE 8: Deploy e CI/CD** 🚀

#### 8.1 Preparar para Deploy

**Frontend (Vercel/Netlify):**
- Configurar variáveis de ambiente
- Configurar build command
- Deploy automático via Git

**Backend (Railway/Render/DigitalOcean):**
- Configurar variáveis de ambiente
- Configurar DATABASE_URL
- Deploy automático via Git

**Database (Supabase/Railway/Neon):**
- PostgreSQL gerenciado
- Backups automáticos
- Connection pooling

#### 8.2 Configurar CI/CD (GitHub Actions)
Criar `.github/workflows/ci.yml` para automação.

---

## 📝 Checklist de Migração

### Backend
- [ ] Prisma configurado e migrations criadas
- [ ] Todos os módulos implementados
- [ ] DTOs com validação configurados
- [ ] Swagger/OpenAPI documentado
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado corretamente
- [ ] Rate limiting implementado
- [ ] Logs configurados
- [ ] Testes unitários passando
- [ ] Dockerfile funcionando

### Frontend
- [ ] Todas as rotas configuradas
- [ ] Componentes standalone implementados
- [ ] Services de API criados
- [ ] Interceptors configurados
- [ ] Loading states implementados
- [ ] Error handling implementado
- [ ] Responsividade testada
- [ ] Animações implementadas
- [ ] SEO configurado (meta tags)
- [ ] Build de produção otimizado
- [ ] Dockerfile funcionando

### DevOps
- [ ] Docker Compose funcional
- [ ] PostgreSQL rodando
- [ ] Frontend acessível
- [ ] Backend acessível
- [ ] Comunicação Frontend-Backend OK
- [ ] Variáveis de ambiente documentadas
- [ ] Scripts de inicialização prontos
- [ ] README atualizado

---

## 🎨 Migração de Estilos

### Do React/Tailwind para Angular/Tailwind

1. **Classes CSS**: Podem ser mantidas praticamente iguais
2. **Componentes**: Reescrever em Angular template syntax
3. **Estados**: Usar signals do Angular 19+
4. **Animações**: Usar @angular/animations
5. **Responsividade**: Manter abordagem mobile-first

---

## 🔄 Migração de Dados

### Conteúdo Estático para Dinâmico

1. **Criar seeders** no Prisma com dados atuais
2. **Popular banco de dados** com informações do portfólio
3. **Testar APIs** para garantir dados corretos
4. **Migrar assets** (imagens, PDFs) para `/assets` ou CDN

---

## 🛠️ Ferramentas Recomendadas

- **VS Code Extensions**:
  - Angular Language Service
  - Prisma
  - Docker
  - ESLint
  - Prettier
  
- **DevTools**:
  - Angular DevTools
  - Postman/Insomnia (testar APIs)
  - Prisma Studio (visualizar dados)
  - Docker Desktop

---

## 📚 Recursos Úteis

- [Angular Docs](https://angular.dev)
- [NestJS Docs](https://docs.nestjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [Docker Docs](https://docs.docker.com)
- [Tailwind CSS](https://tailwindcss.com)

---

## ⚠️ Problemas Comuns e Soluções

### Erro de Conexão com Banco
```bash
# Verificar se PostgreSQL está rodando
docker-compose ps

# Verificar logs
docker-compose logs postgres
```

### Erro de CORS
```typescript
// main.ts no NestJS
app.enableCors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
});
```

### Build do Angular Falha
```bash
# Limpar cache
rm -rf node_modules package-lock.json
npm install
```

---

## 🎯 Próximos Passos Após Migração

1. **Performance**: Implementar lazy loading, code splitting
2. **SEO**: Meta tags dinâmicas, sitemap, robots.txt
3. **Analytics**: Google Analytics, Hotjar
4. **Monitoring**: Sentry para error tracking
5. **Testes**: Aumentar cobertura de testes
6. **Documentação**: Manter docs atualizadas
7. **CI/CD**: Automatizar deploys

---

**Boa sorte com a migração! 🚀**
