#!/usr/bin/env node
'use strict';

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const { spawn } = require('child_process');

const SCRIPT_DIR = __dirname;
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, '..', '..');
const DEFAULT_ENV_FILE = path.join(PROJECT_ROOT, 'apps', 'backend', '.env');

function printHelp() {
  console.log(`MCP PostgreSQL (Pharmacore)\n\nUso:\n  node scripts/mpc/mcp-pharmacore-db.js\n\nVariáveis de ambiente:\n  DATABASE_URL               URL de conexão (prioritária).\n  PHARMACORE_MCP_ENV_FILE    Caminho alternativo de .env (padrão: apps/backend/.env).\n`);
}

function parseEnvValue(rawValue) {
  const trimmed = rawValue.trim();

  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
}

function extractDatabaseUrlFromEnvFile(content) {
  const lines = content.split(/\r?\n/);
  let databaseUrl = '';

  for (const line of lines) {
    const match = line.match(/^\s*DATABASE_URL\s*=\s*(.*)\s*$/);
    if (!match) {
      continue;
    }

    databaseUrl = parseEnvValue(match[1]);
  }

  return databaseUrl;
}

async function resolveDatabaseUrl() {
  if (process.env.DATABASE_URL && String(process.env.DATABASE_URL).trim()) {
    return String(process.env.DATABASE_URL).trim();
  }

  const envFile = process.env.PHARMACORE_MCP_ENV_FILE
    ? path.resolve(process.env.PHARMACORE_MCP_ENV_FILE)
    : DEFAULT_ENV_FILE;

  if (!fs.existsSync(envFile)) {
    throw new Error(
      `Arquivo de ambiente não encontrado em '${envFile}'. ` +
      'Crie apps/backend/.env (baseado em .env.example) ou exporte DATABASE_URL antes de iniciar o MCP.',
    );
  }

  const content = await fsp.readFile(envFile, 'utf8');
  const databaseUrl = extractDatabaseUrlFromEnvFile(content);

  if (!databaseUrl) {
    throw new Error(`DATABASE_URL não encontrada em '${envFile}'.`);
  }

  return databaseUrl;
}

function commandExists(command) {
  return new Promise((resolve) => {
    const checkCmd = process.platform === 'win32' ? 'where' : 'which';
    const child = spawn(checkCmd, [command], {
      stdio: 'ignore',
      shell: false,
      env: process.env,
    });

    child.on('error', () => resolve(false));
    child.on('close', (code) => resolve(code === 0));
  });
}

async function runPostgresMcp(databaseUrl) {
  const npxBin = process.platform === 'win32' ? 'npx.cmd' : 'npx';

  const hasNpx = await commandExists(npxBin);
  if (!hasNpx) {
    throw new Error(`Comando '${npxBin}' não encontrado no PATH.`);
  }

  const child = spawn(npxBin, ['-y', '@modelcontextprotocol/server-postgres', databaseUrl], {
    stdio: 'inherit',
    shell: false,
    env: {
      ...process.env,
      DATABASE_URL: databaseUrl,
    },
  });

  child.on('error', (error) => {
    console.error(`Erro ao iniciar MCP PostgreSQL: ${error.message}`);
    process.exit(1);
  });

  child.on('close', (code, signal) => {
    if (typeof code === 'number') {
      process.exit(code);
      return;
    }

    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(0);
  });
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    return;
  }

  const databaseUrl = await resolveDatabaseUrl();
  if (!databaseUrl.trim()) {
    throw new Error('DATABASE_URL está vazia.');
  }

  await runPostgresMcp(databaseUrl);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`Erro: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  main,
};
