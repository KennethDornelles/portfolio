# Módulo de Configuração

Este diretório contém a configuração centralizada da aplicação usando o `@nestjs/config`.

## Arquivos

### `configuration.ts`
Exporta a configuração da aplicação, organizando as variáveis de ambiente em grupos lógicos:
- **environment**: Ambiente de execução (development, production, test)
- **port**: Porta do servidor
- **api**: Configurações da API (prefixo)
- **database**: Configurações do banco de dados
- **cors**: Configurações de CORS

### `validation.schema.ts`
Define o schema de validação usando Joi para garantir que todas as variáveis de ambiente necessárias estejam presentes e no formato correto.

### `index.ts`
Arquivo barrel para exportar as configurações.

## Como Usar

### Injetar ConfigService em um Módulo

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MyService {
  constructor(private configService: ConfigService) {}

  someMethod() {
    const port = this.configService.get<number>('port');
    const dbUrl = this.configService.get<string>('database.url');
    const environment = this.configService.get<string>('environment');
  }
}
```

### Acessar Valores Aninhados

```typescript
// Para acessar cors.origin
const corsOrigin = this.configService.get<string>('cors.origin');

// Para acessar api.prefix
const apiPrefix = this.configService.get<string>('api.prefix');
```

### Valores Padrão

```typescript
// Se a variável não existir, retorna o valor padrão
const port = this.configService.get<number>('port', 3000);
```

## Variáveis de Ambiente

As seguintes variáveis de ambiente são suportadas:

| Variável      | Tipo   | Obrigatória | Padrão              | Descrição                    |
|---------------|--------|-------------|---------------------|------------------------------|
| NODE_ENV      | string | Não         | development         | Ambiente de execução         |
| PORT          | number | Não         | 3000                | Porta do servidor            |
| DATABASE_URL  | string | Sim         | -                   | URL de conexão do banco      |
| FRONTEND_URL  | string | Não         | http://localhost:4200 | URL do frontend             |
| API_PREFIX    | string | Não         | api                 | Prefixo global da API        |

## Arquivo .env

Crie um arquivo `.env` na raiz do projeto backend com as variáveis necessárias:

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

## Validação

O schema de validação garante que:
- `NODE_ENV` seja um dos valores: `development`, `production`, `test`
- `PORT` seja um número
- `DATABASE_URL` seja uma string e esteja presente
- `FRONTEND_URL` seja uma string
- `API_PREFIX` seja uma string

Se alguma validação falhar, a aplicação não iniciará e exibirá um erro detalhado.

## Configuração Global

O `ConfigModule` é configurado como global no `AppModule`, o que significa que você pode injetar o `ConfigService` em qualquer lugar da aplicação sem precisar importar o módulo novamente.

```typescript
ConfigModule.forRoot({
  isGlobal: true,
  load: [configuration],
  validationSchema,
  envFilePath: '.env',
})
```
