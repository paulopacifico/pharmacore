#!/usr/bin/env node
'use strict';

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const net = require('net');
const readline = require('readline');
const { spawn } = require('child_process');

function detectProjectRoot(startDir) {
  const rootPath = path.parse(startDir).root;
  let currentDir = startDir;

  while (true) {
    const hasRootPackageJson = fs.existsSync(path.join(currentDir, 'package.json'));
    const hasBackendPackageJson = fs.existsSync(path.join(currentDir, 'apps', 'backend', 'package.json'));
    const hasFrontendPackageJson = fs.existsSync(path.join(currentDir, 'apps', 'frontend', 'package.json'));

    if (hasRootPackageJson && hasBackendPackageJson && hasFrontendPackageJson) {
      return currentDir;
    }

    if (currentDir === rootPath) {
      break;
    }

    currentDir = path.dirname(currentDir);
  }

  // Fallback esperado para scripts/project/setup.js
  return path.resolve(startDir, '..', '..');
}

const SCRIPT_DIR = __dirname;
const ROOT_DIR = detectProjectRoot(SCRIPT_DIR);
const BACKEND_DIR = path.join(ROOT_DIR, 'apps', 'backend');
const FRONTEND_DIR = path.join(ROOT_DIR, 'apps', 'frontend');
const BUILD_ATTEMPTS = Math.max(1, Number(process.env.SETUP_BUILD_ATTEMPTS || 3));

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has('--dry-run');
const FORCE_YES = args.has('--yes') || args.has('-y');
const VERBOSE = args.has('--verbose') || args.has('-v');
const SHOW_HELP = args.has('--help') || args.has('-h');
const CLEAN_ONLY = args.has('--clean-only') || args.has('--clean');
const PRISMA_ONLY = args.has('--prisma-only') || args.has('--db-only');
const ANSI_RED = '\x1b[31m';
const ANSI_BOLD = '\x1b[1m';
const ANSI_RESET = '\x1b[0m';
const CLEANUP_DIRECTORY_NAMES = [
  'node_modules',
  '.next',
  'dist',
  'build',
  'coverage',
  '.turbo',
  '.cache',
  '.nyc_output',
  '.parcel-cache',
  '.sass-cache',
  '.nestjs',
  '.nest',
  'reports',
  'report',
  'test-results',
  'playwright-report',
];
const CLEANUP_FILE_NAMES = ['package-lock.json', '.eslintcache'];
const CLEANUP_FILE_SUFFIXES = ['.tsbuildinfo', '.lcov', '.lcov.info'];

function log(message) {
  console.log(message);
}

function logPhase(title) {
  log(`\n🚀 ${title}`);
}

function logInfo(message) {
  log(`ℹ️  ${message}`);
}

function logDetail(message) {
  if (VERBOSE) {
    log(`🔎 ${message}`);
  }
}

function logSuccess(message) {
  log(`✅ ${message}`);
}

function logWarn(message) {
  log(`⚠️  ${message}`);
}

function logError(message) {
  log(`❌ ${message}`);
}

function logCritical(message) {
  log(`${ANSI_RED}${ANSI_BOLD}🛑 ${message}${ANSI_RESET}`);
}

function printRunGuide() {
  const rows = [
    ['node scripts/project/setup.js', 'Execução via raiz do projeto.'],
    ['cd scripts/project && node setup.js', 'Execução dentro da pasta do script.'],
    ['node scripts/project/setup.js --clean-only', 'Apenas limpeza de artefatos gerados (não reconfigura).'],
    ['node scripts/project/setup.js --clean', 'Atalho para --clean-only.'],
    ['node scripts/project/setup.js --prisma-only', 'Executa apenas reset/migrate/seed/generate do Prisma.'],
    ['node scripts/project/setup.js --db-only', 'Atalho para --prisma-only.'],
    ['node scripts/project/setup.js --yes', 'Executa sem perguntar confirmação.'],
    ['node scripts/project/setup.js --dry-run', 'Simula tudo sem alterar arquivos/banco.'],
    ['node scripts/project/setup.js --verbose', 'Mostra logs detalhados de todos os comandos.'],
    [
      'node scripts/project/setup.js --clean-only --yes',
      'Limpa e encerra sem pedir confirmação.',
    ],
    [
      'node scripts/project/setup.js --prisma-only --yes',
      'Roda somente o reset do banco via Prisma sem confirmação.',
    ],
    ['node scripts/project/setup.js --yes --verbose', 'Sem confirmação e com logs detalhados.'],
    ['node scripts/project/setup.js --dry-run --yes --verbose', 'Simulação completa com máximo detalhamento.'],
    ['node scripts/project/setup.js --help', 'Mostra este quadro e encerra.'],
  ];

  const cmdWidth = 58;
  const descWidth = 64;
  const top = `┌${'─'.repeat(cmdWidth + 2)}┬${'─'.repeat(descWidth + 2)}┐`;
  const mid = `├${'─'.repeat(cmdWidth + 2)}┼${'─'.repeat(descWidth + 2)}┤`;
  const bottom = `└${'─'.repeat(cmdWidth + 2)}┴${'─'.repeat(descWidth + 2)}┘`;

  log('\n📘 Mini documentação do setup');
  log(top);
  log(`│ ${'Comando'.padEnd(cmdWidth)} │ ${'O que faz'.padEnd(descWidth)} │`);
  log(mid);
  for (const [command, description] of rows) {
    log(`│ ${command.padEnd(cmdWidth)} │ ${description.padEnd(descWidth)} │`);
  }
  log(bottom);
  logInfo(
    `Modo de log atual: ${VERBOSE ? 'VERBOSE (detalhado)' : 'PADRÃO (somente passos macro)'}.`,
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function exists(filePath) {
  try {
    await fsp.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function askForConfirmation() {
  log('\n⚠️  Resumo do que será apagado/modificado neste setup:');

  if (CLEAN_ONLY) {
    logCritical('Dependências: APAGAR todas as pastas node_modules.');
    logWarn('Lock file: APAGAR package-lock.json.');
    logWarn('Artefatos gerados: APAGAR dist/build/.next/.turbo/caches/coverage/relatórios.');
  } else if (PRISMA_ONLY) {
    logCritical('Banco de dados: APAGAR e RECRIAR do zero.');
    logWarn('Prisma: executar generate + migrate reset + migrations + seed + generate.');
    logWarn('Projeto: NÃO limpar dependências, NÃO instalar pacotes, NÃO executar build.');
  } else {
    logCritical('Dependências: APAGAR todas as pastas node_modules.');
    logWarn('Lock file: APAGAR package-lock.json.');
    logWarn('Artefatos gerados: APAGAR dist/build/.next/.turbo/caches/coverage/relatórios.');
    logCritical('Banco de dados: APAGAR e RECRIAR do zero.');
  }

  if (FORCE_YES) {
    logWarn('Confirmação automática ativada com --yes.');
    return true;
  }

  const question = CLEAN_ONLY
    ? '🧹 Deseja continuar com a limpeza do projeto (sem reconfigurar)? (s/N): '
    : PRISMA_ONLY
      ? '🗄️  Deseja continuar com a recriação do banco via Prisma (sem mexer no restante do projeto)? (s/N): '
      : '🛑 Deseja continuar com o setup absoluto do zero? (s/N): ';

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = await new Promise((resolve) => rl.question(question, resolve));
  rl.close();

  return ['s', 'sim', 'y', 'yes'].includes(answer.trim().toLowerCase());
}

function runCommand(command, commandArgs = [], options = {}) {
  const { cwd = ROOT_DIR, retries = 0, retryDelayMs = 1500 } = options;

  return new Promise((resolve, reject) => {
    const run = (attempt) => {
      const printed = [command, ...commandArgs].join(' ');
      logDetail(`Executando: ${printed} ${cwd ? `(cwd: ${cwd})` : ''}`);

      if (DRY_RUN) {
        resolve();
        return;
      }

      const child = spawn(command, commandArgs, {
        cwd,
        stdio: VERBOSE ? 'inherit' : ['inherit', 'pipe', 'pipe'],
        shell: false,
        env: process.env,
      });

      let outputBuffer = '';
      const appendOutput = (chunk) => {
        outputBuffer += chunk.toString();
        if (outputBuffer.length > 12000) {
          outputBuffer = outputBuffer.slice(-12000);
        }
      };

      if (!VERBOSE) {
        child.stdout.on('data', appendOutput);
        child.stderr.on('data', appendOutput);
      }

      child.on('error', (error) => {
        if (attempt < retries) {
          logWarn(`Falha ao iniciar comando. Nova tentativa (${attempt + 2}/${retries + 1})...`);
          return sleep(retryDelayMs).then(() => run(attempt + 1));
        }
        reject(error);
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve();
          return;
        }

        if (attempt < retries) {
          logWarn(`Comando falhou (exit ${code}). Nova tentativa (${attempt + 2}/${retries + 1})...`);
          return sleep(retryDelayMs).then(() => run(attempt + 1));
        }

        let message = `Comando falhou com exit code ${code}: ${printed}`;
        if (!VERBOSE) {
          const details = outputBuffer.trim();
          if (details) {
            message += `\n--- saída resumida ---\n${details}`;
          }
        }
        reject(new Error(message));
      });
    };

    run(0);
  });
}

async function canRun(command, commandArgs = ['--version']) {
  if (DRY_RUN) {
    return true;
  }

  return new Promise((resolve) => {
    const child = spawn(command, commandArgs, {
      stdio: 'ignore',
      shell: false,
      env: process.env,
    });

    child.on('error', () => resolve(false));
    child.on('close', (code) => resolve(code === 0));
  });
}

async function collectPathsByName(startDir, targetName, options = {}) {
  const ignoredDirNames = new Set(options.ignoredDirNames || ['.git', 'node_modules']);
  const found = [];
  const stack = [startDir];

  while (stack.length > 0) {
    const current = stack.pop();
    let entries = [];

    try {
      entries = await fsp.readdir(current, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      const entryPath = path.join(current, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === targetName) {
          found.push(entryPath);
          continue;
        }

        if (ignoredDirNames.has(entry.name)) {
          continue;
        }

        stack.push(entryPath);
        continue;
      }

      if (entry.isFile() && entry.name === targetName) {
        found.push(entryPath);
      }
    }
  }

  return found;
}

async function collectGeneratedArtifacts(startDir) {
  const found = new Set();

  for (const dirName of CLEANUP_DIRECTORY_NAMES) {
    const paths = await collectPathsByName(startDir, dirName);
    for (const p of paths) {
      found.add(p);
    }
  }

  for (const fileName of CLEANUP_FILE_NAMES) {
    const paths = await collectPathsByName(startDir, fileName);
    for (const p of paths) {
      found.add(p);
    }
  }

  const stack = [startDir];
  while (stack.length > 0) {
    const current = stack.pop();
    let entries = [];

    try {
      entries = await fsp.readdir(current, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      const entryPath = path.join(current, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === '.git' || entry.name === 'node_modules') {
          continue;
        }

        stack.push(entryPath);
        continue;
      }

      if (
        entry.isFile() &&
        CLEANUP_FILE_SUFFIXES.some((suffix) => entry.name.endsWith(suffix))
      ) {
        found.add(entryPath);
      }
    }
  }

  return [...found];
}

async function cleanupWorkspace() {
  logPhase(
    CLEAN_ONLY
      ? 'Fase 1/1 - Limpeza profunda do projeto'
      : 'Fase 1/7 - Limpando dependências e artefatos gerados',
  );
  logInfo('Removendo lock files, dependências, cache, build, cobertura e relatórios gerados.');

  const pathsToRemove = await collectGeneratedArtifacts(ROOT_DIR);
  pathsToRemove.sort((a, b) => b.length - a.length);
  logDetail(`Encontrado(s) ${pathsToRemove.length} artefato(s) para remover.`);

  for (const targetPath of pathsToRemove) {
    logDetail(`Removendo: ${targetPath}`);
    if (!DRY_RUN) {
      await fsp.rm(targetPath, { recursive: true, force: true, maxRetries: 2, retryDelay: 300 });
    }
  }

  logSuccess('Limpeza concluída.');
}

async function ensureEnvFile(appDir) {
  const envPath = path.join(appDir, '.env');
  const examplePath = path.join(appDir, '.env.example');

  if (await exists(envPath)) {
    logDetail(`${envPath} já existe, mantendo como está.`);
    return;
  }

  if (!(await exists(examplePath))) {
    logWarn(`Arquivo de exemplo não encontrado em ${examplePath}.`);
    return;
  }

  logInfo(`Criando ${path.relative(ROOT_DIR, envPath)} a partir do .env.example.`);
  if (!DRY_RUN) {
    await fsp.copyFile(examplePath, envPath);
  }
}

async function ensureEnvFiles() {
  logPhase('Fase 2/7 - Garantindo arquivos .env');
  await ensureEnvFile(BACKEND_DIR);
  await ensureEnvFile(FRONTEND_DIR);
  logSuccess('Arquivos .env verificados.');
}

function parseSimpleEnv(raw) {
  const env = {};
  const lines = raw.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;

    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

async function readBackendDatabaseUrl() {
  const envPath = path.join(BACKEND_DIR, '.env');
  const examplePath = path.join(BACKEND_DIR, '.env.example');
  const sourcePath = (await exists(envPath)) ? envPath : examplePath;

  if (!(await exists(sourcePath))) {
    return null;
  }

  const raw = await fsp.readFile(sourcePath, 'utf8');
  const parsed = parseSimpleEnv(raw);
  return parsed.DATABASE_URL || null;
}

function getDefaultPortByProtocol(protocol) {
  if (protocol === 'postgres:' || protocol === 'postgresql:') return 5432;
  if (protocol === 'mysql:') return 3306;
  if (protocol === 'mongodb:') return 27017;
  return 5432;
}

function parseHostAndPortFromDatabaseUrl(databaseUrl) {
  if (!databaseUrl) {
    return { host: 'localhost', port: 5432 };
  }

  try {
    const url = new URL(databaseUrl);
    const host = url.hostname || 'localhost';
    const port = Number(url.port) || getDefaultPortByProtocol(url.protocol);
    return { host, port };
  } catch {
    return { host: 'localhost', port: 5432 };
  }
}

function isLocalDatabaseHost(host) {
  return ['localhost', '127.0.0.1', '0.0.0.0', '::1'].includes(host);
}

function isPortOpen(host, port, timeoutMs = 2000) {
  if (DRY_RUN) {
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    const socket = new net.Socket();
    let settled = false;

    const finalize = (value) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(value);
    };

    socket.setTimeout(timeoutMs);
    socket.once('connect', () => finalize(true));
    socket.once('error', () => finalize(false));
    socket.once('timeout', () => finalize(false));
    socket.connect(port, host);
  });
}

async function detectDockerComposeCommand() {
  if (await canRun('docker', ['compose', 'version'])) {
    return { command: 'docker', baseArgs: ['compose'] };
  }

  if (await canRun('docker-compose', ['version'])) {
    return { command: 'docker-compose', baseArgs: [] };
  }

  return null;
}

async function ensureDatabaseUp(phaseTitle = 'Fase 3/7 - Verificando banco de dados e Docker Compose') {
  logPhase(phaseTitle);

  const databaseUrl = await readBackendDatabaseUrl();
  const { host, port } = parseHostAndPortFromDatabaseUrl(databaseUrl);
  logDetail(`Banco configurado em ${host}:${port}.`);

  const isLocalHost = isLocalDatabaseHost(host);

  if (!isLocalHost) {
    logWarn(
      `DATABASE_URL aponta para host não local (${host}). Setup não vai iniciar Docker Compose automaticamente.`,
    );
    return;
  }

  const alreadyRunning = await isPortOpen(host, port);
  if (alreadyRunning) {
    logSuccess(`Banco já está acessível em ${host}:${port}. Não será necessário subir Docker Compose.`);
    return;
  }

  const dockerCompose = await detectDockerComposeCommand();
  if (!dockerCompose) {
    logWarn('Docker Compose não encontrado. Continuando sem subir banco automaticamente.');
    return;
  }

  const composeFile = path.join(BACKEND_DIR, 'docker-compose.yml');
  if (!(await exists(composeFile))) {
    logWarn(`Arquivo docker-compose não encontrado em ${composeFile}.`);
    return;
  }

  logInfo('Banco não está no ar. Tentando subir PostgreSQL em background com Docker Compose.');

  try {
    await runCommand(
      dockerCompose.command,
      [...dockerCompose.baseArgs, '-f', 'docker-compose.yml', 'up', '-d', 'postgres'],
      { cwd: BACKEND_DIR },
    );
  } catch {
    logWarn('Falha ao subir serviço "postgres". Tentando docker compose up -d sem nome de serviço...');
    await runCommand(dockerCompose.command, [...dockerCompose.baseArgs, '-f', 'docker-compose.yml', 'up', '-d'], {
      cwd: BACKEND_DIR,
      retries: 1,
    });
  }

  const started = await isPortOpen(host, port);
  if (started) {
    logSuccess(`Banco iniciado com sucesso em ${host}:${port}.`);
    return;
  }

  logWarn(
    `Docker Compose executado, mas porta ${port} ainda não ficou acessível. O setup vai continuar e tentará Prisma mesmo assim.`,
  );
}

async function installDependencies() {
  logPhase('Fase 4/7 - Instalando dependências do projeto');
  await runCommand('npm', ['install'], { cwd: ROOT_DIR, retries: 1, retryDelayMs: 3000 });
  logSuccess('Dependências instaladas.');
}

async function runBuildAttempts(attempts, title) {
  logPhase(title);
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    logInfo(`Tentativa de build ${attempt}/${attempts}.`);
    try {
      await runCommand('npm', ['run', 'build'], {
        cwd: ROOT_DIR,
        retries: 0,
      });
      logSuccess('Build concluído com sucesso.');
      return true;
    } catch (error) {
      logWarn(`Build falhou na tentativa ${attempt}: ${error.message}`);
      if (attempt < attempts) {
        await sleep(2000);
      }
    }
  }

  logWarn(`Build falhou após ${attempts} tentativa(s).`);
  return false;
}

async function runPrismaSetup(
  phaseTitle = 'Fase 6/7 - Executando setup do Prisma (generate + reset/migrate + seed)',
) {
  logPhase(phaseTitle);

  logInfo('Gerando Prisma Client...');
  await runCommand('npx', ['prisma', 'generate'], {
    cwd: BACKEND_DIR,
    retries: 1,
    retryDelayMs: 2500,
  });

  let resetOrMigrateSucceeded = false;

  try {
    logInfo('Resetando banco do zero com Prisma.');
    await runCommand('npx', ['prisma', 'migrate', 'reset', '--force'], {
      cwd: BACKEND_DIR,
      retries: 0,
    });
    resetOrMigrateSucceeded = true;
    logSuccess('Reset do banco concluído e migrations reaplicadas do zero.');
  } catch (error) {
    logWarn(`prisma migrate reset falhou: ${error.message}`);
    logWarn('Tentando fallback para cenário de primeira execução com "prisma migrate dev"...');
  }

  if (!resetOrMigrateSucceeded) {
    try {
      await runCommand(
        'npx',
        ['prisma', 'migrate', 'dev', '--name', 'setup_init'],
        {
          cwd: BACKEND_DIR,
          retries: 0,
        },
      );
      resetOrMigrateSucceeded = true;
      logSuccess('Migrations aplicadas com "prisma migrate dev".');
    } catch (error) {
      logWarn(`prisma migrate dev falhou: ${error.message}`);
      logWarn('Tentando fallback final com "prisma migrate deploy"...');
    }
  }

  if (!resetOrMigrateSucceeded) {
    await runCommand(
      'npx',
      ['prisma', 'migrate', 'deploy'],
      {
        cwd: BACKEND_DIR,
        retries: 0,
      },
    );
    resetOrMigrateSucceeded = true;
    logSuccess('Migrations aplicadas com "prisma migrate deploy".');
  }

  logInfo('Executando seed do banco de dados...');
  try {
    await runCommand('npx', ['prisma', 'db', 'seed'], {
      cwd: BACKEND_DIR,
      retries: 0,
    });
    logSuccess('Seed executado com "prisma db seed".');
  } catch (error) {
    logWarn(`prisma db seed falhou: ${error.message}`);
    logWarn('Tentando fallback com "npx tsx prisma/seed/main.ts"...');
    await runCommand('npx', ['tsx', 'prisma/seed/main.ts'], {
      cwd: BACKEND_DIR,
      retries: 0,
    });
    logSuccess('Seed executado com fallback "npx tsx prisma/seed/main.ts".');
  }

  logInfo('Regenerando Prisma Client após migrations/seed...');
  await runCommand('npx', ['prisma', 'generate'], {
    cwd: BACKEND_DIR,
    retries: 0,
  });

  logSuccess('Setup Prisma concluído.');
}

async function main() {
  log(CLEAN_ONLY ? '🧹 Limpeza do projeto' : PRISMA_ONLY ? '🗄️ Reset Prisma do projeto' : '🧰 Setup absoluto do projeto');
  logInfo(`Raiz: ${ROOT_DIR}`);
  printRunGuide();
  if (DRY_RUN) {
    logWarn('Executando em modo --dry-run (nenhuma alteração real será aplicada).');
  }
  if (SHOW_HELP) {
    process.exit(0);
  }
  if (CLEAN_ONLY && PRISMA_ONLY) {
    logError('As flags --clean-only/--clean e --prisma-only/--db-only são mutuamente exclusivas.');
    process.exit(1);
  }

  const confirmed = await askForConfirmation();
  if (!confirmed) {
    logWarn(
      CLEAN_ONLY
        ? 'Limpeza cancelada pelo usuário.'
        : PRISMA_ONLY
          ? 'Reset Prisma cancelado pelo usuário.'
          : 'Setup cancelado pelo usuário.',
    );
    process.exit(0);
  }

  let hasFailure = false;

  if (PRISMA_ONLY) {
    try {
      await ensureDatabaseUp('Fase 1/2 - Verificando banco de dados e Docker Compose');
    } catch (error) {
      hasFailure = true;
      logError(`Falha ao tentar subir banco com Docker: ${error.message}`);
    }

    try {
      await runPrismaSetup('Fase 2/2 - Executando setup do Prisma (generate + reset/migrate + seed)');
    } catch (error) {
      hasFailure = true;
      logError(`Falha no setup Prisma: ${error.message}`);
    }

    if (hasFailure) {
      logWarn('🏁 Reset Prisma finalizado com alertas/falhas. Revise os logs acima.');
      process.exit(1);
    }

    logSuccess('🎉 Reset Prisma finalizado com sucesso (modo --prisma-only).');
    process.exit(0);
  }

  try {
    await cleanupWorkspace();
  } catch (error) {
    hasFailure = true;
    logError(`Falha na limpeza: ${error.message}`);
  }

  if (CLEAN_ONLY) {
    if (hasFailure) {
      logWarn('🏁 Limpeza finalizada com alertas/falhas. Revise os logs acima.');
      process.exit(1);
    }

    logSuccess('🎉 Limpeza finalizada com sucesso (modo --clean-only).');
    process.exit(0);
  }

  try {
    await ensureEnvFiles();
  } catch (error) {
    hasFailure = true;
    logError(`Falha na configuração dos .env: ${error.message}`);
  }

  try {
    await ensureDatabaseUp();
  } catch (error) {
    hasFailure = true;
    logError(`Falha ao tentar subir banco com Docker: ${error.message}`);
  }

  try {
    await installDependencies();
  } catch (error) {
    logError(`Falha ao instalar dependências: ${error.message}`);
    logError('Sem dependências instaladas não é possível continuar com build/prisma.');
    process.exit(1);
  }

  await runBuildAttempts(1, 'Fase 5/7 - Build inicial (pré-Prisma)');

  try {
    await runPrismaSetup();
  } catch (error) {
    hasFailure = true;
    logError(`Falha no setup Prisma: ${error.message}`);
  }

  const buildOk = await runBuildAttempts(BUILD_ATTEMPTS, 'Fase 7/7 - Build final com retentativas');
  if (!buildOk) {
    hasFailure = true;
  }

  if (hasFailure) {
    logWarn('🏁 Setup finalizado com alertas/falhas em algumas fases. Revise os logs acima.');
    process.exit(1);
  }

  logSuccess('🎉 Setup finalizado com sucesso.');
}

main().catch((error) => {
  logError(`Erro inesperado no setup: ${error.message}`);
  process.exit(1);
});
