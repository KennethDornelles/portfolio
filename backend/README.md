
# Backend - Portfolio API

## 📜 Sobre

API RESTful construída com [NestJS](https://github.com/nestjs/nest) e Prisma ORM para o projeto Portfolio Fullstack.

## ✨ Tecnologias

-   **NestJS:** Framework Node.js progressivo.
-   **Prisma:** ORM moderno para TypeScript e Node.js.
-   **PostgreSQL:** Banco de dados relacional.
-   **TypeScript:** Superset do JavaScript com tipagem estática.
-   **Class Validator:** Validação de dados baseada em decoradores.
-   **@nestjs/config:** Módulo de configuração com validação de variáveis de ambiente.

## ⚙️ Configuração do Ambiente

Este projeto utiliza o `@nestjs/config` para gerenciar e validar as variáveis de ambiente.

### Variáveis de Ambiente

1.  Crie um arquivo `.env` na raiz do diretório `backend/`.
2.  Use o `.env.example` como referência para preencher as variáveis:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio?schema=public"

# Application
NODE_ENV="development"
PORT=3000

# Frontend
FRONTEND_URL="http://localhost:4200"

# API
API_PREFIX="api"
```

Para mais detalhes sobre o sistema de configuração, consulte o [README de Configuração](./src/config/README.md).

### Configuração da API

-   **Prefixo Global:** A API utiliza o prefixo global `/api` para todas as rotas (ex: `/api/projects`).
-   **CORS:** Configurado para aceitar requisições do `FRONTEND_URL` definido no `.env`.

## 🛠️ Desenvolvimento

Siga os passos para executar a aplicação localmente.

### Instalação e Setup

1.  **Instale as dependências:**
    ```bash
    npm install
    ```

2.  **Configure o Banco de Dados:**
    -   Certifique-se de que o PostgreSQL está rodando (via Docker ou localmente).
    -   Ajuste a `DATABASE_URL` no arquivo `.env`.

3.  **Execute as Migrations:**
    ```bash
    npm run prisma:migrate
    ```

4.  **(Opcional) Popule o banco com dados iniciais:**
    ```bash
    npm run prisma:seed
    ```

### Executando a Aplicação

-   **Modo de desenvolvimento (com watch):**
    ```bash
    npm run start:dev
    ```
-   **Modo de produção:**
    ```bash
    npm run build
    npm run start:prod
    ```

### Scripts do Prisma

-   `npm run prisma:generate`: Gera o Prisma Client.
-   `npm run prisma:studio`: Abre a interface visual do Prisma.
-   `npm run prisma:migrate:reset`: Reseta o banco de dados.

## ✅ Testes

-   **Testes unitários:**
    ```bash
    npm run test
    ```
-   **Testes e2e:**
    ```bash
    npm run test:e2e
    ```
-   **Cobertura de testes:**
    ```bash
    npm run test:cov
    ```

