# MCP de Banco de Dados (Codex + Claude)

Este projeto inclui configuração para rodar um MCP de PostgreSQL e permitir consultas SQL via clientes compatíveis com MCP.

## O que foi adicionado

- Script do servidor MCP: `scripts/mpc/mcp-pharmacore-db.js`
- Script geral de setup: `scripts/mpc/setup-mcps.js`
- Arquivo base de configuração do Codex: `scripts/mpc/config.toml`

## Pré-requisitos

1. Banco PostgreSQL em execução (ex.: `apps/backend/docker-compose.yml`).
2. Arquivo `apps/backend/.env` com `DATABASE_URL` válido.
3. Node.js instalado no ambiente.
4. Para configuração no Codex: `codex` instalado.

## Configurar o MCP

Na raiz do projeto:

```bash
node scripts/mpc/setup-mcps.js --target codex
```

Esse comando:

1. Cria `~/.codex/config.toml` se ele ainda não existir (usando `scripts/mpc/config.toml` como base).
2. Garante que o projeto está marcado como trusted no config do Codex.
3. Registra/atualiza todos os MCPs detectados em `scripts/mpc/mcp-*.js`.

Para configurar no Claude:

```bash
node scripts/mpc/setup-mcps.js --target claude
```

Para configurar nos dois de uma vez:

```bash
node scripts/mpc/setup-mcps.js --target all
```

## Validar configuração

```bash
codex mcp list
codex mcp get pharmacore-db
```

Se o app já estiver aberto (Codex/Claude), reinicie para recarregar MCPs.

## Uso no Codex (CLI ou Desktop)

Depois de registrado, você pode pedir algo como:

- "Use o MCP `pharmacore-db` para executar `SELECT NOW();`"
- "Use o MCP `pharmacore-db` para listar as 5 primeiras linhas da tabela `User`"

## Configuração manual (opcional)

Se não quiser usar o script de setup, adicione no `~/.codex/config.toml`:

```toml
[mcp_servers.pharmacore-db]
command = "node"
args = ["/CAMINHO/ABSOLUTO/DO/PROJETO/scripts/mpc/mcp-pharmacore-db.js"]
```

## Segurança recomendada

- Para produção, use usuário de banco com permissões mínimas (idealmente somente leitura para consultas).
- Evite compartilhar `DATABASE_URL` com credenciais reais em commits ou logs.
