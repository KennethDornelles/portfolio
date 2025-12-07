# Rate Limiting

## Visão Geral

O Rate Limiting foi implementado usando o pacote `@nestjs/throttler` para proteger a API contra abuso, ataques DDoS e uso excessivo de recursos.

## Configuração

### Variáveis de Ambiente

Configure as seguintes variáveis no arquivo `.env`:

```env
# Rate Limiting
THROTTLE_TTL=60000      # Tempo em milissegundos (60000ms = 1 minuto)
THROTTLE_LIMIT=10       # Número máximo de requisições permitidas no período
```

### Valores Padrão

Se as variáveis não forem definidas, os valores padrão são:
- **TTL**: 60000ms (1 minuto)
- **LIMIT**: 10 requisições por minuto

## Como Funciona

O Rate Limiting funciona globalmente em toda a aplicação através do `ThrottlerGuard`:

1. **TTL (Time To Live)**: Define a janela de tempo em milissegundos
2. **LIMIT**: Define o número máximo de requisições permitidas nessa janela

Exemplo: Com `THROTTLE_TTL=60000` e `THROTTLE_LIMIT=10`, cada IP pode fazer no máximo 10 requisições por minuto.

## Customização por Rota

### Desabilitar Rate Limiting em Rotas Específicas

Use o decorator `@SkipThrottle()` para desabilitar o rate limiting:

```typescript
import { SkipThrottle } from '@nestjs/throttler';

@Controller('public')
export class PublicController {
  @SkipThrottle()
  @Get()
  getPublicData() {
    return 'Sem rate limiting';
  }
}
```

### Customizar Limites por Rota

Use o decorator `@Throttle()` para definir limites específicos:

```typescript
import { Throttle } from '@nestjs/throttler';

@Controller('api')
export class ApiController {
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('sensitive')
  sensitiveEndpoint() {
    return 'Máximo 3 requisições por minuto';
  }
}
```

### Desabilitar para Métodos Específicos

```typescript
@Controller('mixed')
export class MixedController {
  @Get('limited')
  limitedEndpoint() {
    return 'Rate limiting aplicado (padrão global)';
  }

  @SkipThrottle()
  @Get('unlimited')
  unlimitedEndpoint() {
    return 'Sem rate limiting';
  }
}
```

## Respostas HTTP

Quando o limite é excedido:

### Status Code
```
429 Too Many Requests
```

### Headers
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1638360000
Retry-After: 60
```

### Corpo da Resposta
```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

## Recomendações de Configuração

### Desenvolvimento
```env
THROTTLE_TTL=60000      # 1 minuto
THROTTLE_LIMIT=100      # 100 requisições - mais permissivo
```

### Produção (API Pública)
```env
THROTTLE_TTL=60000      # 1 minuto
THROTTLE_LIMIT=10       # 10 requisições - mais restritivo
```

### Produção (API Autenticada)
```env
THROTTLE_TTL=60000      # 1 minuto
THROTTLE_LIMIT=30       # 30 requisições - moderado
```

### Endpoints Sensíveis (Login, Cadastro)
```typescript
@Throttle({ default: { limit: 5, ttl: 300000 } }) // 5 requisições a cada 5 minutos
@Post('login')
login() {
  // ...
}
```

## Testando Rate Limiting

### Teste Manual com cURL

```bash
# Fazer múltiplas requisições rapidamente
for i in {1..15}; do
  curl -i http://localhost:3000/api/endpoint
  echo "\n---\n"
done
```

### Teste com Node.js Script

```javascript
const axios = require('axios');

async function testRateLimit() {
  for (let i = 1; i <= 15; i++) {
    try {
      const response = await axios.get('http://localhost:3000/api/endpoint');
      console.log(`Request ${i}: ${response.status}`);
    } catch (error) {
      console.log(`Request ${i}: ${error.response?.status} - ${error.message}`);
    }
  }
}

testRateLimit();
```

## Monitoramento

### Logs

O NestJS automaticamente loga tentativas bloqueadas:

```
[Nest] 12345  - 12/07/2025, 10:30:45 AM   ERROR [ThrottlerGuard] Too Many Requests
```

### Métricas Recomendadas

Considere implementar:
- Contador de requisições bloqueadas por IP
- Dashboard de uso da API
- Alertas para IPs com tentativas excessivas

## Considerações de Segurança

1. **Proxy/Load Balancer**: Se usar proxy reverso (nginx, etc.), configure para repassar o IP real:
   ```typescript
   // main.ts
   app.set('trust proxy', 1);
   ```

2. **Rate Limiting por Usuário**: Para APIs autenticadas, considere implementar rate limiting por user ID em vez de IP

3. **Whitelist**: Mantenha lista de IPs confiáveis (monitoramento, health checks) que podem ter limites maiores

4. **Redis**: Para aplicações em múltiplas instâncias, use Redis como storage compartilhado:
   ```typescript
   ThrottlerModule.forRoot({
     storage: new ThrottlerStorageRedisService(redisClient),
     ttl: 60000,
     limit: 10,
   })
   ```

## Troubleshooting

### Problema: Rate limiting muito agressivo
**Solução**: Aumente `THROTTLE_LIMIT` ou `THROTTLE_TTL`

### Problema: Rate limiting não está funcionando
**Verificar**: 
1. ThrottlerGuard está registrado no `APP_GUARD`
2. Variáveis de ambiente estão carregadas corretamente
3. Não há `@SkipThrottle()` inadvertidamente aplicado

### Problema: Health checks sendo bloqueados
**Solução**: 
```typescript
@Controller('health')
export class HealthController {
  @SkipThrottle()
  @Get()
  check() {
    return { status: 'ok' };
  }
}
```

## Recursos Adicionais

- [Documentação oficial @nestjs/throttler](https://docs.nestjs.com/security/rate-limiting)
- [RFC 6585 - Additional HTTP Status Codes](https://tools.ietf.org/html/rfc6585#section-4)
