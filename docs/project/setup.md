# Instruções Iniciais para Rodar o Projeto Pharmacore

Este documento contém as instruções necessárias para configurar e executar o projeto localmente.

---

## Setup em vídeo

Se preferir, você pode seguir o setup do app em vídeo:

- https://youtu.be/Bth_Rua6rFc

> O vídeo é uma referência prática. Em caso de divergência, priorize este documento e os comandos do repositório.

---

## 1. Instalar as dependências

Na raiz do projeto, execute:

```bash
npm install
```

---

## 2. Configurar os arquivos de ambiente

Renomeie os arquivos de exemplo para `.env`:

- **Backend:** `apps/backend/.env.example` → `apps/backend/.env`
- **Frontend:** `apps/frontend/.env.example` → `apps/frontend/.env`

---

## 3. Subir o Docker Compose (banco de dados)

Entre na pasta do backend e inicie os containers:

```bash
cd apps/backend
docker-compose up -d
cd ../..
```

> ⚠️ **Importante:** Sempre que for rodar o projeto, certifique-se de que o Docker Compose está online e os containers estão em execução.

---

## 4. Configurar o Prisma

Na pasta do backend, execute os comandos do Prisma:

```bash
cd apps/backend
npx prisma migrate dev
npx prisma generate
cd ../..
```

---

## 5. Build do projeto

**Após** rodar os comandos do Prisma, volte para a raiz do projeto e execute:

```bash
npm run build
```

---

## 6. Popular o banco de dados (seed)

O seed é **obrigatório**: sem ele o app não funciona direito, pois precisa dos perfis (roles) para funcionar. Execute:

```bash
cd apps/backend
npx prisma db seed
cd ../..
```

---

## 7. Iniciar o servidor de desenvolvimento

Na raiz do projeto, execute:

```bash
npm run dev
```

---

## 8. Acessar a plataforma

Após concluir todos os passos, você pode fazer login na plataforma utilizando o usuário pré-criado no seed.

As credenciais estão definidas em `apps/backend/prisma/seed/data/auth/users.json`:

| Campo     | Valor              |
| --------- | ------------------ |
| **Nome**  | Admin User         |
| **Email** | admin@formacao.dev |
| **Senha** | #Senha123          |

---

## 9. Configurar MCP de banco (Codex e Claude)

Este projeto já possui scripts em JavaScript para configurar o MCP PostgreSQL no Codex e no Claude.

Na raiz do projeto, execute:

```bash
node scripts/mpc/setup-mcps.js --target codex
```

Para configurar no Claude:

```bash
node scripts/mpc/setup-mcps.js --target claude
```

Para configurar em ambos:

```bash
node scripts/mpc/setup-mcps.js --target all
```

Depois valide:

```bash
codex mcp list
codex mcp get pharmacore-db
```

Se o Codex Desktop estiver aberto, reinicie o app para carregar o MCP.

Guia completo: `docs/mcp/codex-mcp-db.md`

---

## Resumo dos comandos (ordem de execução)

```bash
# 1. Instalar dependências
npm install

# 2. Renomear .env.example para .env (backend e frontend)

# 3. Docker (na pasta apps/backend)
cd apps/backend && docker-compose up -d && cd ../..

# 4. Prisma (na pasta apps/backend)
cd apps/backend
npx prisma migrate dev
npx prisma generate
cd ../..

# 5. Build (após o Prisma)
npm run build

# 6. Seed (obrigatório)
cd apps/backend && npx prisma db seed && cd ../..

# 7. Dev
npm run dev
```

---

## Solução de problemas

- **Docker não inicia:** Verifique se o Docker Desktop está instalado e em execução.
- **Erro de conexão com o banco:** Confirme se o `docker-compose up -d` foi executado e os containers estão rodando.
- **Prisma migrate falha:** Certifique-se de que o banco de dados está online antes de rodar as migrations.
