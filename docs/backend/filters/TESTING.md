# Testando os Exception Filters

Este guia mostra como testar os Exception Filters implementados.

## 🧪 Testes Automáticos

Execute os testes unitários:

```bash
npm test -- src/filters
```

## 🚀 Testes Manuais com a API

### 1. Inicie o servidor

```bash
npm run start:dev
```

### 2. Teste HttpExceptionFilter

#### Erro 400 - Bad Request (Validação)

```bash
# Criar projeto sem campos obrigatórios
curl -X POST http://localhost:3000/projects \
  -H "Content-Type: application/json" \
  -d '{}'

# Resposta esperada:
# {
#   "statusCode": 400,
#   "timestamp": "2025-11-17T...",
#   "path": "/projects",
#   "method": "POST",
#   "message": ["title should not be empty", "description should not be empty", ...],
#   "error": "Bad Request"
# }
```

#### Erro 404 - Not Found

```bash
# Buscar recurso inexistente
curl http://localhost:3000/projects/999999

# Resposta esperada:
# {
#   "statusCode": 404,
#   "timestamp": "2025-11-17T...",
#   "path": "/projects/999999",
#   "method": "GET",
#   "message": "Project with ID 999999 not found",
#   "error": "NotFoundException"
# }
```

### 3. Teste PrismaExceptionFilter

#### P2002 - Unique Constraint Violation

```bash
# Criar dois projetos com o mesmo slug
curl -X POST http://localhost:3000/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Project",
    "slug": "test-project",
    "description": "Test",
    "technologies": ["Node.js"]
  }'

# Tentar criar outro com mesmo slug
curl -X POST http://localhost:3000/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Another Test",
    "slug": "test-project",
    "description": "Test",
    "technologies": ["React"]
  }'

# Resposta esperada:
# {
#   "statusCode": 409,
#   "timestamp": "2025-11-17T...",
#   "path": "/projects",
#   "method": "POST",
#   "message": "Já existe um registro com este(s) valor(es) para: slug",
#   "error": "UniqueConstraintViolation",
#   "code": "P2002"
# }
```

#### P2025 - Record Not Found

```bash
# Atualizar projeto inexistente
curl -X PATCH http://localhost:3000/projects/99999 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated"}'

# Resposta esperada:
# {
#   "statusCode": 404,
#   "timestamp": "2025-11-17T...",
#   "path": "/projects/99999",
#   "method": "PATCH",
#   "message": "Registro não encontrado",
#   "error": "NotFound",
#   "code": "P2025"
# }
```

#### P2003 - Foreign Key Constraint

```bash
# Criar recurso com referência inválida
curl -X POST http://localhost:3000/code-examples \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Example",
    "code": "console.log()",
    "language": "javascript",
    "projectId": 99999
  }'

# Resposta esperada:
# {
#   "statusCode": 400,
#   "timestamp": "2025-11-17T...",
#   "path": "/code-examples",
#   "method": "POST",
#   "message": "Violação de restrição de chave estrangeira",
#   "error": "ForeignKeyConstraintViolation",
#   "code": "P2003"
# }
```

### 4. Teste AllExceptionsFilter

Este filtro captura qualquer exceção não tratada. Para testar, você pode:

1. **Temporariamente adicionar um erro proposital** em um controller:

```typescript
// Em qualquer controller
@Get('test-error')
testError() {
  throw new Error('Erro de teste não tratado');
}
```

2. **Fazer a requisição:**

```bash
curl http://localhost:3000/projects/test-error

# Resposta esperada:
# {
#   "statusCode": 500,
#   "timestamp": "2025-11-17T...",
#   "path": "/projects/test-error",
#   "method": "GET",
#   "message": "Erro de teste não tratado",
#   "error": "Error"
# }
```

## 📝 Observações

### Logs

Todos os erros são logados no console do servidor:

```
[Nest] 12345  - 17/11/2025, 10:30:00   ERROR [HttpExceptionFilter] HTTP 400 Error: POST /projects
{"statusCode":400,"timestamp":"2025-11-17T13:30:00.000Z",...}
```

### Ambiente de Desenvolvimento vs Produção

**Development** (NODE_ENV=development):
- Inclui campo `details` com informações adicionais
- Stack traces completos
- Metadados do Prisma

**Production** (NODE_ENV=production):
- Apenas informações essenciais
- Sem stack traces
- Sem detalhes internos

### Testando com Postman/Insomnia

1. Importe a collection (se existir)
2. Configure variáveis de ambiente:
   - `baseUrl`: http://localhost:3000
3. Execute as requisições de teste

## 🔍 Verificando Logs

Para ver logs detalhados durante os testes:

```bash
# Modo desenvolvimento com logs
npm run start:dev

# Observar o terminal para ver:
# - Erros HTTP
# - Erros Prisma
# - Exceções não tratadas
```

## ✅ Checklist de Testes

- [ ] Validação de DTOs (400)
- [ ] Recursos não encontrados (404)
- [ ] Violação de constraint única (409)
- [ ] Violação de chave estrangeira (400)
- [ ] Tentativa de deletar registro com dependências (409)
- [ ] Erro de conexão com BD (503)
- [ ] Exceções genéricas (500)
- [ ] Logs sendo gerados corretamente
- [ ] Formato de resposta padronizado
- [ ] Detalhes apenas em development

## 📚 Recursos Adicionais

- [Documentação dos Filtros](./README.md)
- [Códigos de Erro Prisma](https://www.prisma.io/docs/reference/api-reference/error-reference)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
