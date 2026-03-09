#!/usr/bin/env node
'use strict';

const fs = require('fs');
const fsp = fs.promises;
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const SCRIPT_DIR = __dirname;
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, '..', '..');
const TEMPLATE_FILE = path.join(SCRIPT_DIR, 'config.toml');

const CODEX_HOME_DIR = process.env.CODEX_HOME || path.join(os.homedir(), '.codex');
const CODEX_CONFIG_FILE = process.env.CODEX_CONFIG_FILE || path.join(CODEX_HOME_DIR, 'config.toml');

function parseArgs(argv) {
  const args = {
    target: 'codex',
    help: false,
    dryRun: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];

    if (current === '--help' || current === '-h') {
      args.help = true;
      continue;
    }

    if (current === '--dry-run') {
      args.dryRun = true;
      continue;
    }

    if (current.startsWith('--target=')) {
      args.target = current.slice('--target='.length);
      continue;
    }

    if (current.startsWith('--ai=')) {
      args.target = current.slice('--ai='.length);
      continue;
    }

    if (current === '--target' || current === '--ai') {
      const next = argv[index + 1];
      if (!next) {
        throw new Error(`Valor ausente para ${current}.`);
      }
      args.target = next;
      index += 1;
      continue;
    }

    throw new Error(`Argumento não suportado: ${current}`);
  }

  return args;
}

function printHelp() {
  console.log(`Setup de MCPs (multi-IA)\n\nUso:\n  node scripts/mpc/setup-mcps.js [--target codex|claude|cloud|all] [--dry-run]\n\nOpções:\n  --target, --ai  IA de destino para configurar (padrão: codex).\n  --dry-run       Simula alterações sem gravar arquivos/comandos.\n  -h, --help      Mostra esta ajuda.\n\nExemplos:\n  node scripts/mpc/setup-mcps.js --target codex\n  node scripts/mpc/setup-mcps.js --target claude\n  node scripts/mpc/setup-mcps.js --target all\n`);
}

function resolveTargets(targetInputRaw) {
  const targetInput = String(targetInputRaw || 'codex').toLowerCase();

  if (targetInput === 'all') {
    return ['codex', 'claude'];
  }

  if (targetInput === 'cloud') {
    return ['claude'];
  }

  if (targetInput === 'codex' || targetInput === 'claude') {
    return [targetInput];
  }

  throw new Error(`Destino inválido: '${targetInputRaw}'. Use codex, claude, cloud ou all.`);
}

function escapeTomlBasicString(value) {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function hasProjectTrustBlock(content, projectRoot) {
  const escapedPath = escapeTomlBasicString(projectRoot);
  const posixPath = projectRoot.replace(/\\/g, '/');

  return (
    content.includes(`[projects."${projectRoot}"]`) ||
    content.includes(`[projects."${escapedPath}"]`) ||
    content.includes(`[projects."${posixPath}"]`)
  );
}

async function ensureCodexBaseConfig({ dryRun }) {
  const escapedRoot = escapeTomlBasicString(PROJECT_ROOT);
  const trustBlock = `[projects."${escapedRoot}"]\ntrust_level = "trusted"\n`;

  const configDir = path.dirname(CODEX_CONFIG_FILE);
  if (!dryRun) {
    await fsp.mkdir(configDir, { recursive: true });
  }

  let created = false;
  let appendedTrust = false;
  let current = '';

  const exists = fs.existsSync(CODEX_CONFIG_FILE);
  if (!exists) {
    let content;

    if (fs.existsSync(TEMPLATE_FILE)) {
      const template = await fsp.readFile(TEMPLATE_FILE, 'utf8');
      content = template.replace(/__PROJECT_ROOT__/g, escapedRoot);
    } else {
      content = [
        'model = "gpt-5.3-codex"',
        'model_reasoning_effort = "high"',
        '',
        trustBlock.trimEnd(),
        '',
      ].join('\n');
    }

    if (!dryRun) {
      await fsp.writeFile(CODEX_CONFIG_FILE, content, 'utf8');
    }

    current = content;
    created = true;
  } else {
    current = await fsp.readFile(CODEX_CONFIG_FILE, 'utf8');
  }

  if (!hasProjectTrustBlock(current, PROJECT_ROOT)) {
    const separator = current.endsWith('\n') ? '\n' : '\n\n';
    if (!dryRun) {
      await fsp.appendFile(CODEX_CONFIG_FILE, `${separator}${trustBlock}`, 'utf8');
    }
    appendedTrust = true;
  }

  return { created, appendedTrust };
}

function spawnAndCapture(command, args, { cwd = PROJECT_ROOT, env = process.env } = {}) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd,
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false,
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', (error) => {
      resolve({ code: -1, stdout, stderr: `${stderr}${error.message}`.trim(), error });
    });

    child.on('close', (code) => {
      resolve({ code: code ?? 0, stdout, stderr });
    });
  });
}

async function commandExists(command) {
  const check = process.platform === 'win32' ? ['where', command] : ['which', command];
  const result = await spawnAndCapture(check[0], check.slice(1));
  return result.code === 0;
}

function sanitizeCodexOutput(raw) {
  return raw
    .split(/\r?\n/)
    .filter((line) => !line.startsWith('WARNING: proceeding, even though we could not update PATH:'))
    .join('\n')
    .trim();
}

function areStringArraysEqual(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) {
    return false;
  }

  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

function areCodexServersEqual(current, expectedCommand, expectedArgs) {
  if (!current || typeof current !== 'object') {
    return false;
  }

  const currentCommand = current.command;
  const currentArgs = Array.isArray(current.args) ? current.args : [];

  return currentCommand === expectedCommand && areStringArraysEqual(currentArgs, expectedArgs);
}

function getClaudeConfigFilePath() {
  if (process.env.CLAUDE_CONFIG_FILE) {
    return path.resolve(process.env.CLAUDE_CONFIG_FILE);
  }

  if (process.platform === 'darwin') {
    return path.join(os.homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
  }

  if (process.platform === 'win32') {
    const appData = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
    return path.join(appData, 'Claude', 'claude_desktop_config.json');
  }

  const xdgConfigHome = process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config');
  return path.join(xdgConfigHome, 'Claude', 'claude_desktop_config.json');
}

async function discoverMcpScripts() {
  const entries = await fsp.readdir(SCRIPT_DIR, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) => /^mcp-.*\.js$/i.test(fileName))
    .sort((a, b) => a.localeCompare(b))
    .map((fileName) => {
      const baseName = fileName.replace(/^mcp-/i, '').replace(/\.js$/i, '');

      return {
        serverName: baseName,
        scriptPath: path.join(SCRIPT_DIR, fileName),
      };
    });
}

async function codexGetServer(serverName) {
  const result = await spawnAndCapture('codex', ['mcp', 'get', serverName, '--json']);
  if (result.code !== 0) {
    return null;
  }

  const cleanedStdout = sanitizeCodexOutput(result.stdout);
  if (!cleanedStdout) {
    return null;
  }

  try {
    return JSON.parse(cleanedStdout);
  } catch {
    return null;
  }
}

async function codexRemoveServer(serverName, { dryRun }) {
  if (dryRun) {
    return;
  }

  await spawnAndCapture('codex', ['mcp', 'remove', serverName]);
}

async function codexAddServer(serverName, command, args, { dryRun }) {
  if (dryRun) {
    return;
  }

  const result = await spawnAndCapture('codex', ['mcp', 'add', serverName, '--', command, ...args]);
  if (result.code !== 0) {
    throw new Error(`Falha ao registrar MCP '${serverName}' no Codex:\n${result.stderr || result.stdout}`.trim());
  }
}

async function configureCodex(mcpServers, { dryRun }) {
  const codexInstalled = await commandExists('codex');
  if (!codexInstalled) {
    throw new Error("Comando 'codex' não encontrado no PATH.");
  }

  const configInfo = await ensureCodexBaseConfig({ dryRun });

  let created = 0;
  let updated = 0;
  let unchanged = 0;

  for (const server of mcpServers) {
    const expectedCommand = 'node';
    const expectedArgs = [server.scriptPath];

    const current = await codexGetServer(server.serverName);

    if (!current) {
      await codexAddServer(server.serverName, expectedCommand, expectedArgs, { dryRun });
      console.log(`Codex: registrado MCP '${server.serverName}' -> ${expectedCommand} ${expectedArgs.join(' ')}`);
      created += 1;
      continue;
    }

    if (areCodexServersEqual(current, expectedCommand, expectedArgs)) {
      console.log(`Codex: MCP '${server.serverName}' já está configurado corretamente.`);
      unchanged += 1;
      continue;
    }

    await codexRemoveServer(server.serverName, { dryRun });
    await codexAddServer(server.serverName, expectedCommand, expectedArgs, { dryRun });

    console.log(`Codex: atualizado MCP '${server.serverName}' -> ${expectedCommand} ${expectedArgs.join(' ')}`);
    updated += 1;
  }

  return {
    target: 'codex',
    created,
    updated,
    unchanged,
    details: {
      configFile: CODEX_CONFIG_FILE,
      createdConfigFile: configInfo.created,
      appendedTrust: configInfo.appendedTrust,
    },
  };
}

function safeJsonParse(input, fallback) {
  try {
    return JSON.parse(input);
  } catch {
    return fallback;
  }
}

function areObjectsDeepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

async function configureClaude(mcpServers, { dryRun }) {
  const configFile = getClaudeConfigFilePath();
  const configDir = path.dirname(configFile);

  let currentConfig = {};
  if (fs.existsSync(configFile)) {
    const raw = await fsp.readFile(configFile, 'utf8');
    currentConfig = safeJsonParse(raw, null);

    if (!currentConfig || typeof currentConfig !== 'object' || Array.isArray(currentConfig)) {
      throw new Error(`Arquivo de configuração do Claude inválido: ${configFile}`);
    }
  }

  const nextConfig = { ...currentConfig };
  const existingServers = currentConfig.mcpServers && typeof currentConfig.mcpServers === 'object'
    ? currentConfig.mcpServers
    : {};

  nextConfig.mcpServers = { ...existingServers };

  let created = 0;
  let updated = 0;
  let unchanged = 0;

  for (const server of mcpServers) {
    const desired = {
      command: 'node',
      args: [server.scriptPath],
    };

    const current = nextConfig.mcpServers[server.serverName];

    if (!current) {
      nextConfig.mcpServers[server.serverName] = desired;
      created += 1;
      console.log(`Claude: registrado MCP '${server.serverName}' -> node ${server.scriptPath}`);
      continue;
    }

    if (areObjectsDeepEqual(current, desired)) {
      unchanged += 1;
      console.log(`Claude: MCP '${server.serverName}' já está configurado corretamente.`);
      continue;
    }

    nextConfig.mcpServers[server.serverName] = desired;
    updated += 1;
    console.log(`Claude: atualizado MCP '${server.serverName}' -> node ${server.scriptPath}`);
  }

  if (!dryRun) {
    await fsp.mkdir(configDir, { recursive: true });
    await fsp.writeFile(configFile, `${JSON.stringify(nextConfig, null, 2)}\n`, 'utf8');
  }

  return {
    target: 'claude',
    created,
    updated,
    unchanged,
    details: {
      configFile,
    },
  };
}

function formatResult(result) {
  return [
    `- ${result.target}:`,
    `  - Criados: ${result.created}`,
    `  - Atualizados: ${result.updated}`,
    `  - Sem alteração: ${result.unchanged}`,
  ].join('\n');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  const targets = resolveTargets(args.target);
  const mcpServers = await discoverMcpScripts();

  if (mcpServers.length === 0) {
    throw new Error(`Nenhum script MCP encontrado em ${SCRIPT_DIR} (padrão mcp-*.js).`);
  }

  console.log(`Projeto: ${PROJECT_ROOT}`);
  console.log(`Destino(s): ${targets.join(', ')}`);
  console.log(`Dry-run: ${args.dryRun ? 'sim' : 'não'}`);

  const results = [];

  for (const target of targets) {
    if (target === 'codex') {
      results.push(await configureCodex(mcpServers, { dryRun: args.dryRun }));
      continue;
    }

    if (target === 'claude') {
      results.push(await configureClaude(mcpServers, { dryRun: args.dryRun }));
      continue;
    }
  }

  console.log('\nSetup de MCPs concluído.');
  for (const result of results) {
    console.log(formatResult(result));
    if (result.details.configFile) {
      console.log(`  - Configuração: ${result.details.configFile}`);
    }
    if (result.target === 'codex' && result.details.createdConfigFile) {
      console.log('  - Criado config base do Codex.');
    }
    if (result.target === 'codex' && result.details.appendedTrust) {
      console.log('  - Adicionado trust_level para o projeto no Codex.');
    }
  }

  console.log('\nPróximos passos sugeridos:');
  if (targets.includes('codex')) {
    console.log('- Rode: codex mcp list');
    console.log('- Se usar Codex Desktop, reinicie o app para recarregar MCPs.');
  }
  if (targets.includes('claude')) {
    console.log('- Abra/reinicie o app do Claude para recarregar MCPs.');
  }
}

main().catch((error) => {
  console.error(`Erro: ${error.message}`);
  process.exit(1);
});
