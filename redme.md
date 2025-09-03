# 🔗 Shorty - Encurtador de Links com Autenticação JWT

API para encurtar URLs com autenticação de usuários (JWT) e suporte a CRUD de links.
Feito com **Node.js + Express + MongoDB**.

---

## 📦 Tecnologias

* Node.js
* Express
* MongoDB (Mongoose)
* JWT (autenticação)
* Bcrypt (hash de senha)
* ShortId (geração do link curto)

---

## ⚙️ Instalação

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/shorty-backend.git
cd shorty-backend

# Instalar dependências
npm install

# Criar arquivo .env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/shortener
JWT_SECRET=umsegredobemseguro
```

---

## ▶️ Executando

```bash
npm run dev   # com nodemon
# ou
npm start
```

Servidor rodando em:
👉 `http://localhost:3000`

---

## 🔐 Autenticação

Todos os endpoints de **links** exigem um **token JWT**.
Use o endpoint `/api/auth/login` para obtê-lo e envie no header:

```http
Authorization: Bearer <seu_token>
```

---

## 📌 Endpoints

### 👤 Autenticação

#### Registrar usuário

```http
POST /api/auth/register
```

Body:

```json
{
  "name": "Caio",
  "email": "caio@test.com",
  "password": "123456"
}
```

#### Login

```http
POST /api/auth/login
```

Body:

```json
{
  "email": "caio@test.com",
  "password": "123456"
}
```

Resposta:

```json
{
  "message": "Login bem-sucedido",
  "user": {
    "id": "68b753f24c1f6c32d6493706",
    "name": "Caio",
    "email": "caio@test.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5c..."
}
```

---

### 🔗 Links

#### Criar link

```http
POST /api/links
```

Header:

```
Authorization: Bearer <token>
```

Body:

```json
{
  "originalUrl": "https://google.com"
}
```

Resposta:

```json
{
  "message": "Link criado com sucesso",
  "link": {
    "id": "68b767d52ac03ef07e757573",
    "shortId": "DTnAn4",
    "originalUrl": "https://google.com"
  }
}
```

#### Listar links do usuário

```http
GET /api/links
Authorization: Bearer <token>
```

#### Atualizar link

```http
PUT /api/links/:shortId
Authorization: Bearer <token>
```

Body:

```json
{
  "originalUrl": "https://github.com"
}
```

#### Deletar link

```http
DELETE /api/links/:shortId
Authorization: Bearer <token>
```

---

### 🌍 Redirecionamento Público

```http
GET /:shortId
```

Exemplo:

```
GET http://localhost:3000/DTnAn4
```

➡️ Redireciona para `https://google.com`

---

## 🛠 Testando com cURL

Registrar:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Caio","email":"caio@test.com","password":"123456"}'
```

Login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"caio@test.com","password":"123456"}'
```

Criar link:

```bash
curl -X POST http://localhost:3000/api/links \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"originalUrl":"https://google.com"}'
```

---

## 📖 Fluxo resumido

1. Registrar usuário
2. Fazer login → pegar token JWT
3. Criar link curto com o token
4. Acessar `http://localhost:3000/<shortId>` → redireciona
  