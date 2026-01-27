#!/bin/bash

# Configuração
API_URL="http://localhost:3000/api"
EMAIL="test@barberboss.com"
PASSWORD="securePassword123"

# Função auxiliar para extrair JSON usando Node.js com tratamento de erro
extract_json_field() {
  echo $1 | node -pe "try { const input = fs.readFileSync(0, 'utf-8'); if(!input.trim()) throw new Error('Empty input'); console.log(JSON.parse(input).$2 || '') } catch(e) { console.error('Erro ao processar JSON: ' + e.message); process.exit(1); }"
}

# Verificação de Saúde do Servidor
echo "0. Verificando se o servidor está online..."
HTTP_STATUS=$(curl -o /dev/null -s -w "%{http_code}\n" "$API_URL")
if [ "$HTTP_STATUS" == "000" ]; then
  echo "❌ ERRO: Não foi possível conectar ao servidor em $API_URL"
  echo "⚠️  Certifique-se de que o backend está rodando em outro terminal com: npm run start:dev"
  exit 1
fi
echo "✅ Servidor detectado!"

echo -e "\n1. Registrando Usuário..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"passwordHash\": \"$PASSWORD\", \"role\": \"ADMIN\"}")

# Verifica se a resposta está vazia
if [ -z "$REGISTER_RESPONSE" ]; then
    echo "❌ Erro: Resposta vazia do servidor no registro."
    exit 1
fi
echo $REGISTER_RESPONSE

echo -e "\n\n2. Realizando Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/signin" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

if [ -z "$LOGIN_RESPONSE" ]; then
    echo "❌ Erro: Resposta vazia do servidor no login."
    exit 1
fi
echo $LOGIN_RESPONSE

# Extrair Tokens de forma segura
ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | node -pe "try { JSON.parse(fs.readFileSync(0, 'utf-8')).accessToken } catch(e) { '' }")
REFRESH_TOKEN=$(echo $LOGIN_RESPONSE | node -pe "try { JSON.parse(fs.readFileSync(0, 'utf-8')).refreshToken } catch(e) { '' }")

if [ -z "$ACCESS_TOKEN" ] || [ "$ACCESS_TOKEN" == "undefined" ]; then
    echo "❌ Erro: Falha ao obter Access Token. Verifique o log do servidor."
    exit 1
fi

echo -e "\n\nAccess Token: ${ACCESS_TOKEN:0:20}..."
echo "Refresh Token: ${REFRESH_TOKEN:0:20}..."

echo -e "\n\n3. Acessando Rota Protegida (Logout com Token de Acesso)..."
curl -s -X POST "$API_URL/auth/logout" \
  -H "Authorization: Bearer $ACCESS_TOKEN"

echo -e "\n\n4. Renovando Token (Refresh)..."
REFRESH_RESPONSE=$(curl -s -X POST "$API_URL/auth/refresh" \
  -H "Authorization: Bearer $REFRESH_TOKEN")
echo $REFRESH_RESPONSE

NEW_AT=$(echo $REFRESH_RESPONSE | node -pe "try { JSON.parse(fs.readFileSync(0, 'utf-8')).accessToken } catch(e) { '' }")

echo -e "\n\nNovo Access Token: ${NEW_AT:0:20}..."

echo -e "\n\n5. Checagem de Segurança: Reutilizando Refresh Token Antigo (Deve Falhar)..."
curl -s -X POST "$API_URL/auth/refresh" \
  -H "Authorization: Bearer $REFRESH_TOKEN"
