# Personal Info Module

## Descrição

Módulo responsável por gerenciar as informações pessoais do portfólio. Este módulo implementa um padrão **Singleton**, permitindo apenas um registro de informações pessoais no banco de dados.

## Estrutura de Arquivos

```
src/modules/personal-info/
├── dto/
│   ├── create-personal-info.dto.ts    # DTO para criação
│   └── update-personal-info.dto.ts    # DTO para atualização
├── entities/
│   └── personal-info.entity.ts        # Entidade TypeScript
├── personal-info.controller.ts        # Controller com endpoints REST
├── personal-info.module.ts            # Módulo NestJS
└── personal-info.service.ts           # Service com lógica de negócio
```

## Endpoints

### POST /personal-info
Cria um novo registro de informações pessoais.

**Request Body:**
```json
{
  "name": "Seu Nome",
  "title": "Full Stack Developer",
  "bio": "Desenvolvedor apaixonado por criar soluções inovadoras.",
  "email": "seu.email@exemplo.com",
  "phone": "+55 (11) 99999-9999",
  "location": "São Paulo, Brasil",
  "avatar": "https://exemplo.com/avatar.jpg",
  "resumeUrl": "https://exemplo.com/resume.pdf"
}
```

**Response:** `201 Created`

**Nota:** Como este é um singleton, uma tentativa de criar um segundo registro resultará em erro `409 Conflict`.

### GET /personal-info
Retorna todos os registros de informações pessoais (normalmente apenas um).

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "Seu Nome",
    "title": "Full Stack Developer",
    "bio": "Desenvolvedor apaixonado por criar soluções inovadoras.",
    "email": "seu.email@exemplo.com",
    "phone": "+55 (11) 99999-9999",
    "location": "São Paulo, Brasil",
    "avatar": "https://exemplo.com/avatar.jpg",
    "resumeUrl": "https://exemplo.com/resume.pdf",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

### GET /personal-info/current
Retorna o registro atual de informações pessoais (o primeiro encontrado).

**Response:** `200 OK`

### GET /personal-info/:id
Retorna um registro específico por ID.

**Response:** `200 OK` ou `404 Not Found`

### PATCH /personal-info/:id
Atualiza um registro existente.

**Request Body:** (todos os campos são opcionais)
```json
{
  "name": "Nome Atualizado",
  "title": "Senior Full Stack Developer"
}
```

**Response:** `200 OK`

### DELETE /personal-info/:id
Remove um registro.

**Response:** `204 No Content`

## Validações

O DTO de criação (`CreatePersonalInfoDto`) implementa as seguintes validações:

- **name**: String obrigatória e não vazia
- **title**: String obrigatória e não vazia
- **bio**: String obrigatória e não vazia
- **email**: Email válido obrigatório
- **phone**: String opcional
- **location**: String opcional
- **avatar**: String opcional (URL)
- **resumeUrl**: String opcional (URL)

## Modelo do Banco de Dados

O schema do Prisma para Personal Info:

```prisma
model PersonalInfo {
  id          String   @id @default(uuid())
  name        String
  title       String
  bio         String   @db.Text
  email       String
  phone       String?
  location    String?
  avatar      String?
  resumeUrl   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("personal_info")
}
```

## Exemplo de Uso

### Criar informações pessoais

```typescript
// POST /personal-info
const response = await fetch('http://localhost:3000/personal-info', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'João Silva',
    title: 'Full Stack Developer',
    bio: 'Desenvolvedor com 5 anos de experiência...',
    email: 'joao@exemplo.com',
    phone: '+55 (11) 98765-4321',
    location: 'São Paulo, SP',
  }),
});
```

### Obter informações atuais

```typescript
// GET /personal-info/current
const response = await fetch('http://localhost:3000/personal-info/current');
const personalInfo = await response.json();
```

### Atualizar informações

```typescript
// PATCH /personal-info/:id
const response = await fetch(`http://localhost:3000/personal-info/${id}`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Senior Full Stack Developer',
    bio: 'Desenvolvedor com 7 anos de experiência...',
  }),
});
```
