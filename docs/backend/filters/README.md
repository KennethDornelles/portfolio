# Exception Filters

Este diretório contém os filtros de exceção globais da aplicação, responsáveis por padronizar e tratar erros de forma consistente.

## 📁 Estrutura

```
filters/
├── all-exceptions.filter.ts      # Filtro genérico para todas as exceções
├── http-exception.filter.ts      # Filtro para exceções HTTP do NestJS
├── prisma-exception.filter.ts    # Filtro para erros do Prisma
└── index.ts                       # Exports centralizados
```

## 🎯 Filtros Implementados

### 1. HttpExceptionFilter

Captura e trata todas as exceções HTTP do NestJS (`HttpException`).

**Recursos:**
- Formata resposta padronizada de erro
- Extrai mensagens e detalhes da exceção
- Adiciona informações de contexto (timestamp, path, method)
- Log estruturado de erros
- Detalhes adicionais em ambiente de desenvolvimento

**Exemplo de resposta:**
```json
{
  "statusCode": 400,
  "timestamp": "2025-11-17T10:30:00.000Z",
  "path": "/api/projects",
  "method": "POST",
  "message": "Validation failed",
  "error": "BadRequestException"
}
```

### 2. PrismaExceptionFilter

Captura e trata erros do Prisma Client, traduzindo-os para respostas HTTP apropriadas.

**Erros tratados:**

| Código Prisma | Status HTTP | Descrição |
|--------------|-------------|-----------|
| P2002 | 409 Conflict | Violação de constraint única |
| P2025 | 404 Not Found | Registro não encontrado |
| P2003 | 400 Bad Request | Violação de chave estrangeira |
| P2014 | 409 Conflict | Registros dependentes existem |
| P2000 | 400 Bad Request | Valor muito longo |
| P2011 | 400 Bad Request | Campo obrigatório ausente |
| P1001 | 503 Service Unavailable | Erro de conexão com BD |

**Exemplo de resposta:**
```json
{
  "statusCode": 409,
  "timestamp": "2025-11-17T10:30:00.000Z",
  "path": "/api/projects",
  "method": "POST",
  "message": "Já existe um registro com este(s) valor(es) para: slug",
  "error": "UniqueConstraintViolation",
  "code": "P2002"
}
```

### 3. AllExceptionsFilter

Filtro catch-all para capturar qualquer exceção não tratada pelos filtros específicos.

**Recursos:**
- Última camada de defesa
- Previne vazamento de erros sem tratamento
- Log crítico de exceções inesperadas
- Retorna mensagem genérica ao cliente
- Stack trace disponível apenas em desenvolvimento

## 🚀 Uso

Os filtros são registrados globalmente no `main.ts`:

```typescript
app.useGlobalFilters(
  new HttpExceptionFilter(),
  new PrismaExceptionFilter(),
  new AllExceptionsFilter(), // Deve ser sempre o último
);
```

**⚠️ Importante:** A ordem dos filtros importa! Filtros mais específicos devem vir antes dos genéricos.

## 💡 Lançando Exceções nos Controllers/Services

### Exceções HTTP Padrão do NestJS

```typescript
import {
  BadRequestException,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

// Erro 400
throw new BadRequestException('Dados inválidos');

// Erro 404
throw new NotFoundException('Projeto não encontrado');

// Erro 409
throw new ConflictException('Projeto já existe');

// Erro 401
throw new UnauthorizedException('Token inválido');

// Erro 403
throw new ForbiddenException('Sem permissão');
```

### Com Mensagens Personalizadas

```typescript
throw new BadRequestException({
  message: 'Validação falhou',
  errors: ['Campo nome é obrigatório', 'Email inválido'],
});
```

## 🔍 Formato de Resposta Padronizado

Todas as respostas de erro seguem este formato:

```typescript
interface ErrorResponse {
  statusCode: number;        // Status HTTP
  timestamp: string;         // ISO 8601 timestamp
  path: string;             // URL da requisição
  method: string;           // Método HTTP (GET, POST, etc)
  message: string | string[]; // Mensagem de erro
  error: string;            // Nome do erro
  code?: string;            // Código específico (ex: código Prisma)
  details?: unknown;        // Detalhes adicionais (apenas em dev)
}
```

## 🔒 Segurança

### Ambiente de Produção
- Mensagens genéricas para erros inesperados
- Stack traces e detalhes internos são ocultados
- Apenas informações necessárias são expostas

### Ambiente de Desenvolvimento
- Mensagens detalhadas de erro
- Stack traces completos
- Metadados do Prisma
- Detalhes da exceção original

## 📊 Logs

Todos os filtros utilizam o Logger do NestJS para registrar erros:

```typescript
this.logger.error(
  `HTTP 400 Error: POST /api/projects`,
  JSON.stringify(errorResponse),
);
```

**Níveis de log:**
- `error`: Erros esperados (HTTP, Prisma)
- `error` + stack trace: Erros inesperados (AllExceptions)

## 🧪 Testando os Filtros

### Testar HttpExceptionFilter
```bash
# Enviar dados inválidos
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Testar PrismaExceptionFilter
```bash
# Criar registro duplicado
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"slug": "existing-slug", ...}'
```

### Testar AllExceptionsFilter
```typescript
// No código: lançar erro não tratado
throw new Error('Unexpected error');
```

## 🎨 Boas Práticas

1. **Use exceções específicas**: Prefira `NotFoundException` ao invés de `HttpException(404)`
2. **Mensagens claras**: Forneça mensagens descritivas para o cliente
3. **Não exponha internos**: Evite expor detalhes de implementação em produção
4. **Log adequado**: Use níveis de log apropriados para cada tipo de erro
5. **Validação cedo**: Valide dados antes de operações de banco de dados

## 📚 Recursos

- [NestJS Exception Filters](https://docs.nestjs.com/exception-filters)
- [Prisma Error Reference](https://www.prisma.io/docs/reference/api-reference/error-reference)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

```