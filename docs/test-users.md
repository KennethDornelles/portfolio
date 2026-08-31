# Usuários para testes de segurança

Este documento descreve somente as contas efetivamente criadas pelo seed e as contas adicionais necessárias para testar SEC-001, SEC-002 e SEC-003.

Não registre senhas reais neste arquivo. Use credenciais exclusivas do ambiente local ou de teste.

## Inventário do seed

O script [`backend/prisma/seed.ts`](../backend/prisma/seed.ts) cria no máximo um usuário.

| Conta | E-mail | Senha | Papel | Persistida | Origem |
|---|---|---|---|---|---|
| Administrador | valor de `ADMIN_EMAIL` | valor de `ADMIN_PASSWORD` | `ADMIN` | Sim | `backend/prisma/seed.ts` |

Observações:

- se `ADMIN_EMAIL` ou `ADMIN_PASSWORD` estiver ausente, o seed ignora a criação do administrador;
- `ADMIN_NAME` é lido pelo script, mas o modelo `User` atual não possui campo `name` e esse valor não é persistido;
- se o e-mail já existir, o seed não atualiza senha, papel ou status do usuário existente;
- nenhuma conta `USER`, `CONSULTANT` ou `CLIENT` é criada pelo seed;
- o endpoint de guest gera um token `GUEST`, mas não cria usuário no banco e não gera refresh token.

## Configuração local

Defina valores próprios em `backend/.env`, sem adicioná-los ao Git:

```env
ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_NAME=
```

Use uma senha exclusiva para testes. Não reutilize senha pessoal ou de produção.

Execute o seed:

```powershell
cd backend
npm run seed
```

Ou pelo Compose:

```powershell
docker compose run --rm backend npm run seed
```

O resultado esperado contém uma destas mensagens:

```text
Admin user created: <e-mail configurado>
```

ou:

```text
Admin user already exists.
```

No segundo caso, a senha válida continua sendo a senha usada quando a conta foi criada. Alterar apenas `ADMIN_PASSWORD` e executar novamente o seed não troca a senha existente.

## Conta ADMIN

Use os valores configurados no ambiente:

```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "<ADMIN_EMAIL>",
  "password": "<ADMIN_PASSWORD>"
}
```

Essa conta serve para validar:

- acesso autorizado às operações administrativas i18n;
- preservação do papel `ADMIN` após refresh;
- rotação e reutilização de refresh token.

Para o teste de reutilização, prefira um administrador descartável ou um banco isolado. A política atual revoga todos os refresh tokens ativos do proprietário.

## Conta USER para testar `403`

Como o seed não cria usuário comum, cadastre uma conta descartável pelo endpoint público:

```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "<EMAIL_USER_DE_TESTE>",
  "password": "<SENHA_USER_DE_TESTE>"
}
```

Requisitos atuais:

- e-mail válido e ainda não cadastrado;
- senha com no mínimo 6 caracteres;
- o papel padrão atribuído pelo banco é `USER`.

Depois faça login:

```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "<EMAIL_USER_DE_TESTE>",
  "password": "<SENHA_USER_DE_TESTE>"
}
```

Use o access token retornado para confirmar que endpoints administrativos i18n respondem `403`.

## Conta GUEST

O guest não usa e-mail ou senha:

```http
POST /api/auth/guest
```

O endpoint retorna somente access token com papel `GUEST`. Ele pode ser usado em verificações de autorização de leitura, mas não serve para testar refresh token.

## Matriz recomendada

| Cenário | Conta |
|---|---|
| Endpoint administrativo sem autenticação retorna `401` | Nenhuma |
| Endpoint administrativo com papel insuficiente retorna `403` | `USER` descartável |
| Operação administrativa autorizada | `ADMIN` do seed |
| Papel permanece `ADMIN` após refresh | `ADMIN` descartável ou do seed |
| Token expirado, revogado ou reutilizado | Usuário descartável |
| Acesso guest | Token retornado por `/api/auth/guest` |

## Verificação sem expor senha ou hash

Para listar somente dados não sensíveis diretamente no PostgreSQL do Compose:

```powershell
docker compose exec postgres psql -U postgres -d portfolio_db -c 'SELECT email, role, "isActive", "deletedAt" FROM users ORDER BY email;'
```

Não consulte nem copie `passwordHash`, access tokens ou refresh tokens para relatórios e logs.

## Nota sobre `check-user.ts`

`backend/prisma/check-user.ts` é um utilitário de diagnóstico, não um seed. Ele contém fallbacks legados de credenciais e não deve ser considerado fonte de contas cadastradas nem usado com valores de produção.
