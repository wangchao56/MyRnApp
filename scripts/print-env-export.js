#!/usr/bin/env node
/** Print shell exports for `.env` — usage: eval "$(node scripts/print-env-export.js)" */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const envPath = [path.join(ROOT, '.env'), path.join(ROOT, '.env.local')].find(fs.existsSync);

if (!envPath) {
  console.error('# No .env found. Run: pnpm setup:env');
  process.exit(1);
}

const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
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
  const escaped = val.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  console.log(`export ${key}="${escaped}"`);
}
