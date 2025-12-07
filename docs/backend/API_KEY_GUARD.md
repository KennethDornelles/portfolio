# API Key Guard - Documentação

## 📋 Visão Geral

O **API Key Guard** é um mecanismo de autenticação simples e eficiente implementado para proteger os endpoints da API do portfólio. Ele fornece proteção adequada para um site pessoal, sem a complexidade desnecessária de JWT/OAuth.

## 🔐 Funcionamento

### Conceito

- **Endpoints GET (leitura)**: Públicos, acessíveis sem autenticação
- **Endpoints POST/PATCH/DELETE (escrita)**: Protegidos, requerem API Key válida
- **Exceção**: `POST /contact-message` é público para permitir envio de mensagens

### Implementação

1. **Guard Global**: Aplicado automaticamente em todos os endpoints
2. **Decorator @Public()**: Marca rotas específicas como públicas
3. **Header x-api-key**: Contém a chave de API para autenticação

## 🚀 Configuração

### 1. Variáveis de Ambiente

Adicione ao arquivo `.env`:

```env
# API Key para autenticação (mínimo 32 caracteres)
API_KEY=sua-chave-super-secreta-aqui-com-pelo-menos-32-caracteres
```

**Gerando uma API Key segura:**

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# OpenSSL
openssl rand -hex 32

# Python
python -c "import secrets; print(secrets.token_hex(32))"
```

### 2. Validação Automática

A API Key é validada automaticamente na inicialização:

- ✅ Deve ter no mínimo 32 caracteres
- ✅ É obrigatória (aplicação não inicia sem ela)
- ⚠️ Um aviso é exibido se não estiver configurada

## 📝 Uso nos Controllers

### Protegendo Endpoints (Padrão)

Por padrão, todos os endpoints estão protegidos:

```typescript
@Controller('projects')
export class ProjectController {
  @Post()
  @ApiSecurity('api-key') // Documenta no Swagger
  @ApiResponse({ status: 401, description: 'API Key inválida ou ausente' })
  create(@Body() dto: CreateProjectDto) {
    return this.service.create(dto);
  }
}
```

### Tornando Endpoints Públicos

Use o decorator `@Public()`:

```typescript
import { Public } from '../../decorators';

@Controller('projects')
export class ProjectController {
  @Get()
  @Public() // Este endpoint é público
  findAll() {
    return this.service.findAll();
  }
}
```

### Padrão Recomendado

```typescript
import { Controller, Get, Post, Patch, Delete } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { Public } from '../../decorators';

@Controller('projects')
export class ProjectController {
  // 📖 Endpoints de leitura - públicos
  @Get()
  @Public()
  findAll() { }

  @Get(':id')
  @Public()
  findOne() { }

  // 🔒 Endpoints de escrita - protegidos
  @Post()
  @ApiSecurity('api-key')
  create() { }

  @Patch(':id')
  @ApiSecurity('api-key')
  update() { }

  @Delete(':id')
  @ApiSecurity('api-key')
  remove() { }
}
```

## 🧪 Testando a API Key

### 1. Endpoint de Verificação

```bash
# Sem API Key (deve falhar)
curl http://localhost:3000/api/auth/verify

# Com API Key válida
curl -H "x-api-key: sua-chave-aqui" http://localhost:3000/api/auth/verify
```

### 2. No Swagger UI

1. Acesse: `http://localhost:3000/api/docs`
2. Clique no botão **"Authorize"** (cadeado)
3. Insira sua API Key no campo `x-api-key`
4. Clique em **"Authorize"**
5. Teste os endpoints protegidos

### 3. Com Postman/Insomnia

Adicione um header:
- **Key**: `x-api-key`
- **Value**: `sua-chave-api-aqui`

### 4. Com cURL

```bash
# GET (público - sem API Key)
curl http://localhost:3000/api/projects

# POST (protegido - com API Key)
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: sua-chave-api-aqui" \
  -d '{"title": "Novo Projeto"}' \
  http://localhost:3000/api/projects
```

## 🔧 Integração com Frontend

### Angular HttpClient

```typescript
import { HttpClient, HttpHeaders } from '@angular/common/http';

export class ApiService {
  private apiKey = environment.apiKey;

  constructor(private http: HttpClient) {}

  // GET público (sem API Key)
  getProjects() {
    return this.http.get('/api/projects');
  }

  // POST protegido (com API Key)
  createProject(data: any) {
    const headers = new HttpHeaders({
      'x-api-key': this.apiKey
    });
    return this.http.post('/api/projects', data, { headers });
  }
}
```

### Fetch API

```javascript
// GET público
fetch('/api/projects')
  .then(res => res.json())
  .then(data => console.log(data));

// POST protegido
fetch('/api/projects', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'sua-chave-api-aqui'
  },
  body: JSON.stringify({ title: 'Novo Projeto' })
});
```

## ⚠️ Segurança

### ✅ Boas Práticas

1. **Nunca commitar a API Key**: Use `.env` e adicione ao `.gitignore`
2. **Chave complexa**: Mínimo 32 caracteres aleatórios
3. **HTTPS em produção**: Sempre use TLS/SSL
4. **Renovação periódica**: Troque a chave regularmente
5. **Armazene com segurança**: Use secrets managers (GitHub Secrets, Vercel Env, etc.)

### 🚫 O que NÃO fazer

- ❌ Expor a API Key no código frontend (arquivos .ts/.js)
- ❌ Incluir no repositório público
- ❌ Usar a mesma chave em dev e prod
- ❌ Compartilhar via canais não seguros (email, chat, etc.)

### 🔐 Armazenamento no Frontend

Para o admin panel, você pode:

1. **Variáveis de ambiente do build** (Next.js, Vite):
   ```
   VITE_API_KEY=chave-secreta
   ```

2. **Backend-for-Frontend (BFF)**: O ideal é ter um servidor intermediário que adiciona a API Key

3. **Login admin**: Implementar login simples que retorna a API Key após autenticação

## 📊 Monitoramento

### Logs do Guard

O ApiKeyGuard registra:
- ✅ Acessos autorizados
- ❌ Tentativas com API Key inválida
- ⚠️ Requisições sem API Key
- 📖 Acessos a rotas públicas

Exemplo de logs:

```
[ApiKeyGuard] ✅ Rota pública - acesso permitido
[ApiKeyGuard] ❌ API Key ausente na requisição
[ApiKeyGuard] ❌ API Key inválida fornecida
[ApiKeyGuard] ✅ API Key válida - acesso permitido
```

## 🆚 Comparação com Alternativas

| Aspecto | API Key Guard | JWT/OAuth | Sem Auth |
|---------|--------------|-----------|----------|
| Complexidade | ⭐ Baixa | ⭐⭐⭐ Alta | ⭐ Nenhuma |
| Tempo implementação | 2h | 8-16h | 0h |
| Segurança | ⭐⭐⭐ Adequada | ⭐⭐⭐⭐⭐ Alta | ❌ Nenhuma |
| Manutenção | ⭐ Fácil | ⭐⭐⭐ Complexa | ⭐ Nenhuma |
| Ideal para | Portfolio pessoal | Apps corporativos | Apenas leitura |

## 🎯 Quando Usar API Key Guard

✅ **Use quando:**
- Site/portfólio pessoal
- API com poucos usuários admin (1-5)
- Maioria dos dados são públicos
- Precisa de proteção básica contra bots

❌ **NÃO use quando:**
- Múltiplos usuários com permissões diferentes
- Precisa de sessões/logout
- Dados altamente sensíveis
- App corporativo com compliance rigoroso

## 🔄 Migração Futura

Se precisar migrar para JWT/OAuth:

1. O `@Public()` decorator continuará funcionando
2. Substitua `ApiKeyGuard` por `JwtAuthGuard`
3. Endpoints protegidos continuarão protegidos
4. Adicione lógica de roles/permissions conforme necessário

## 📚 Referências

- [NestJS Guards](https://docs.nestjs.com/guards)
- [NestJS Custom Decorators](https://docs.nestjs.com/custom-decorators)
- [OpenAPI/Swagger Security](https://swagger.io/docs/specification/authentication/)
- [OWASP API Security](https://owasp.org/www-project-api-security/)

## 🤝 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do servidor
2. Teste com o endpoint `/api/auth/verify`
3. Confirme que a API Key está correta no `.env`
4. Verifique os headers da requisição
