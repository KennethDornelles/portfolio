
# Portfolio Fullstack

## 📜 Sobre o Projeto

Este é um projeto full-stack que serve como meu portfólio pessoal, demonstrando minhas habilidades em desenvolvimento web com tecnologias modernas. O backend é construído com NestJS e o frontend com Angular.

## 🏗️ Arquitetura

O projeto é organizado em uma estrutura de monorepo com duas partes principais:

-   `./backend/`: A API RESTful construída com NestJS, responsável pela lógica de negócios e comunicação com o banco de dados.
-   `./frontend/`: A aplicação single-page (SPA) construída com Angular, que consome a API do backend para exibir as informações.

## ✨ Tecnologias

As seguintes tecnologias foram utilizadas no desenvolvimento do projeto:

**Frontend:**

-   **Angular:** Um framework robusto para construir aplicações web.
-   **TypeScript:** Superset do JavaScript que adiciona tipagem estática.

**Backend:**

-   **NestJS:** Um framework Node.js progressivo para construir aplicações eficientes e escaláveis.
-   **Prisma:** ORM de próxima geração para Node.js e TypeScript.
-   **PostgreSQL:** Um poderoso banco de dados relacional de código aberto.

**Infraestrutura:**

-   **Docker:** Plataforma para desenvolver, enviar e executar aplicações em contêineres.

## 🚀 Funcionalidades Implementadas

O backend atualmente suporta as seguintes funcionalidades:

-   **CodeExample:** Gerenciamento de exemplos de código.
-   **ContactMessage:** Armazenamento de mensagens de contato.
-   **Education:** Gerenciamento de informações sobre formação acadêmica.
-   **Experience:** Gerenciamento de experiências profissionais.
-   **PersonalInfo:** Gerenciamento de informações pessoais.
-   **Project:** Gerenciamento de projetos do portfólio.
-   **Service:** Gerenciamento de serviços oferecidos.
-   **Skill:** Gerenciamento de habilidades.
-   **SocialLink:** Gerenciamento de links para redes sociais.
-   **Testimonial:** Gerenciamento de depoimentos.

## 🛠️ Desenvolvimento

Siga os passos abaixo para configurar o ambiente de desenvolvimento local.

### Pré-requisitos

-   [Node.js](https://nodejs.org/en/) (versão 20.x ou superior)
-   [Docker](https://www.docker.com/get-started) (para o banco de dados)

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/portfolio-fullstack.git
    cd portfolio-fullstack
    ```

2.  **Inicie o banco de dados com Docker:**
    ```bash
    docker-compose up -d
    ```

3.  **Backend:**
    ```bash
    cd backend
    npm install
    npm run prisma:migrate # Aplica as migrações do banco de dados
    npm run start:dev
    ```

4.  **Frontend:**
    ```bash
    cd ../frontend
    npm install
    npm run start
    ```

### Comandos Úteis

-   **Backend:**
    -   `npm run build`: Compila a aplicação para produção.
    -   `npm run lint`: Executa o linter para análise de código.
-   **Frontend:**
    -   `npm run build`: Compila a aplicação para produção.

## ✅ Testes

Para executar os testes, utilize os seguintes comandos nos respectivos diretórios (`frontend` ou `backend`):

-   `npm test`

## 📚 Documentação

A documentação adicional do projeto pode ser encontrada nos seguintes arquivos:

-   [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
-   [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
-   [backend/HEALTH_CHECK_TESTING.md](./backend/HEALTH_CHECK_TESTING.md)

## 🗺️ Roadmap

Veja o [ROADMAP.md](./ROADMAP.md) para detalhes sobre as próximas funcionalidades e melhorias planejadas. (Arquivo a ser criado)

## 🤝 Contribuição

Contribuições são o que tornam a comunidade de código aberto um lugar incrível para aprender, inspirar e criar. Qualquer contribuição que você fizer será **muito apreciada**.

1.  Faça um Fork do projeto
2.  Crie sua Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Faça o Commit de suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4.  Faça o Push para a Branch (`git push origin feature/AmazingFeature`)
5.  Abra um Pull Request

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações. (Arquivo a ser criado)

## 💬 Contato

Kenneth Dornelles - [LinkedIn](https://www.linkedin.com/in/kenneth-dornelles/)

Link do Projeto: [https://github.com/KennethDornelles/portfolio-fullstack](https://github.com/KennethDornelles/portfolio-fullstack)
