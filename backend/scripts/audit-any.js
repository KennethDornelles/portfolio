#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const BACKEND_ROOT = path.join(REPO_ROOT, 'backend');
const FRONTEND_ROOT = path.join(REPO_ROOT, 'frontend');
const EXCLUDED = new Set(['node_modules', 'dist', 'build', '.git', 'coverage', '.angular']);

function usage() {
  console.log(`Usage: npm run audit:any -- [options]\n\nOptions:\n  --json [file]  print JSON (or write it to file)\n  --help         show this help`);
}

function walk(dir, files = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    if (EXCLUDED.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.isFile()) files.push(full);
  }
  return files;
}

function relative(file) {
  return path.relative(REPO_ROOT, file).replaceAll(path.sep, '/');
}

function add(findings, severity, check, file, message, line) {
  findings.push({ severity, check, file: file ? relative(file) : undefined, line, message });
}

function scanAny(findings) {
  for (const root of [path.join(BACKEND_ROOT, 'src'), path.join(FRONTEND_ROOT, 'src')]) {
    for (const file of walk(root).filter((name) =>
      /\.(ts|tsx)$/.test(name) && !/\.spec\.ts$/.test(name) && !/\.d\.ts$/.test(name),
    )) {
      const content = fs.readFileSync(file, 'utf8');
      const source = ts.createSourceFile(relative(file), content, ts.ScriptTarget.Latest, true);
      const lines = content.split(/\r?\n/);
      function visit(node) {
        if (node.kind === ts.SyntaxKind.AnyKeyword) {
          const position = source.getLineAndCharacterOfPosition(node.getStart(source));
          add(findings, 'error', 'typescript-no-any', file, lines[position.line].trim(), position.line + 1);
        }
        ts.forEachChild(node, visit);
      }
      visit(source);
    }
  }
}

function scanText(findings, file, checks) {
  if (!fs.existsSync(file)) return;
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const check of checks) {
      if (check.pattern.test(line)) add(findings, check.severity || 'error', check.name, file, check.message, index + 1);
    }
  });
}

function scanConfiguration(findings) {
  const sourceFiles = walk(path.join(BACKEND_ROOT, 'src')).filter((file) => file.endsWith('.ts'));
  for (const file of sourceFiles) {
    scanText(findings, file, [
      { name: 'secret-fallback', pattern: /(?:JWT_SECRET|JWT_REFRESH_SECRET|I18N_WEBHOOK_SECRET)\s*\)?\s*\|\|\s*['"`][^'"`]+['"`]/, message: 'Secret obrigatório possui fallback literal.' },
      { name: 'secret-log', pattern: /(?:console\.(?:log|error)|logger\.(?:log|error|warn|debug)).*(?:SECRET|PASSWORD|API_KEY|signature)/i, message: 'Possível registro de credencial ou assinatura.' },
    ]);
  }
}

function scanArchitecture(findings) {
  const compose = path.join(REPO_ROOT, 'docker-compose.yml');
  if (!fs.existsSync(compose)) add(findings, 'error', 'compose-present', compose, 'docker-compose.yml não encontrado.');
  else {
    const content = fs.readFileSync(compose, 'utf8');
    if (!/\n\s+redis:/.test(content)) add(findings, 'error', 'compose-redis', compose, 'Serviço redis não declarado.');
    if (!/REDIS_HOST:\s*redis/.test(content)) add(findings, 'error', 'compose-redis-host', compose, 'Backend não está configurado com REDIS_HOST=redis.');
    if (!/REDIS_PORT:\s*6379/.test(content)) add(findings, 'error', 'compose-redis-port', compose, 'Backend não está configurado com REDIS_PORT=6379.');
    if (/POSTGRES_PASSWORD:\s*\$\{[^}]*:-[^}]+\}/.test(content)) add(findings, 'error', 'compose-secret-fallback', compose, 'Senha do PostgreSQL possui fallback no Compose.');
  }

  const schema = path.join(BACKEND_ROOT, 'prisma', 'schema.prisma');
  const migrations = path.join(BACKEND_ROOT, 'prisma', 'migrations');
  if (!fs.existsSync(schema)) add(findings, 'error', 'prisma-schema', schema, 'Schema Prisma não encontrado.');
  if (!fs.existsSync(migrations) || !walk(migrations).some((file) => file.endsWith('migration.sql'))) {
    add(findings, 'error', 'prisma-migrations', migrations, 'Nenhuma migration Prisma versionada encontrada.');
  }

  const i18nService = path.join(BACKEND_ROOT, 'src', 'modules', 'i18n', 'i18n.service.ts');
  if (fs.existsSync(i18nService) && /set\([^\n]+\{\}\s*,/.test(fs.readFileSync(i18nService, 'utf8'))) {
    add(findings, 'error', 'i18n-empty-cache', i18nService, 'I18n pode persistir mapa vazio no cache.');
  }
  for (const file of walk(path.join(FRONTEND_ROOT, 'src')).filter((name) => name.endsWith('.ts'))) {
    scanText(findings, file, [{
      name: 'ssr-browser-global',
      pattern: /\blocalStorage\b|\bwindow\b|\bdocument\b/,
      severity: 'warning',
      message: 'Uso de API exclusiva do navegador; confirme proteção SSR.',
    }]);
  }
  if (!fs.existsSync(path.join(REPO_ROOT, '.github', 'workflows', 'ci.yml'))) {
    add(findings, 'warning', 'ci-workflow', null, 'Workflow CI não encontrado.');
  }
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help')) return usage();
  const json = args.includes('--json');
  const findings = [];
  scanAny(findings);
  scanConfiguration(findings);
  scanArchitecture(findings);
  const summary = {
    root: REPO_ROOT,
    filesScanned: [...new Set([
      ...walk(path.join(BACKEND_ROOT, 'src')),
      ...walk(path.join(FRONTEND_ROOT, 'src')),
    ].filter((file) => /\.(ts|tsx)$/.test(file)))].length,
    findings,
    counts: findings.reduce((result, finding) => {
      result[finding.severity] = (result[finding.severity] || 0) + 1;
      return result;
    }, {}),
  };
  if (json) {
    const destination = args[args.indexOf('--json') + 1];
    const output = JSON.stringify(summary, null, 2);
    if (destination && !destination.startsWith('--')) fs.writeFileSync(path.resolve(process.cwd(), destination), `${output}\n`);
    else console.log(output);
  } else {
    if (!findings.length) console.log('Nenhuma ocorrência encontrada.');
    else {
      console.error(`${findings.length} ocorrência(s) encontrada(s):\n`);
      for (const finding of findings) console.error(`  [${finding.severity}] ${finding.check} ${finding.file || ''}${finding.line ? `:${finding.line}` : ''} -> ${finding.message}`);
    }
    console.log(`\nArquivos TypeScript verificados: ${summary.filesScanned}`);
  }
  process.exitCode = findings.some((finding) => finding.severity === 'error') ? 1 : 0;
}

main();
