#!/usr/bin/env node
/**
 * Run a command with variables from `.env` (or `.env.local`).
 * Usage: node scripts/with-env.js <command> [args...]
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function loadEnvFile(filePath) {
  const merged = { ...process.env };
  if (!fs.existsSync(filePath)) {
    return merged;
  }
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    const eq = trimmed.indexOf('=');
    if (eq === -1) {
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    merged[key] = val;
  }
  return merged;
}

function resolveEnvFile() {
  const dotEnv = path.join(ROOT, '.env');
  const dotEnvLocal = path.join(ROOT, '.env.local');
  if (fs.existsSync(dotEnv)) {
    return dotEnv;
  }
  if (fs.existsSync(dotEnvLocal)) {
    return dotEnvLocal;
  }
  return null;
}

const envFile = resolveEnvFile();
const env = envFile ? loadEnvFile(envFile) : { ...process.env };

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node scripts/with-env.js <command> [args...]');
  process.exit(1);
}

if (envFile) {
  console.log(`[with-env] loaded ${path.basename(envFile)}`);
}

const [cmd, ...cmdArgs] = args;
const child = spawn(cmd, cmdArgs, {
  cwd: ROOT,
  env,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

child.on('exit', code => {
  process.exit(code === null ? 1 : code);
});

child.on('error', err => {
  console.error('[with-env]', err.message);
  process.exit(1);
});
