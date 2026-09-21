import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'dist');

process.env.NODE_ENV = 'production';

const PLACEHOLDER_RE = /your-api-host|your-domain|example\.com|localhost|127\.0\.0\.1|raida\.local/i;
const LEAK_RE = /Password123!|sourceMappingURL/i;

function readViteEnv() {
  // Vite order, later files win. Process env already set wins over files.
  const fromFiles = {};
  for (const fileName of ['.env', '.env.local', '.env.production', '.env.production.local']) {
    const filePath = join(root, fileName);
    if (!existsSync(filePath)) continue;
    const text = readFileSync(filePath, 'utf8');
    for (const rawLine of text.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const eq = line.indexOf('=');
      if (eq < 1) continue;
      const key = line.slice(0, eq).trim();
      let value = line.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      fromFiles[key] = value;
    }
  }
  return {
    apiBase: (process.env.VITE_API_BASE_URL || fromFiles.VITE_API_BASE_URL || '').replace(/\/$/, ''),
    siteUrl: (process.env.VITE_SITE_URL || fromFiles.VITE_SITE_URL || '').replace(/\/$/, ''),
  };
}

function fail(problems) {
  console.error(`Invalid production client build:\n${problems.join('\n')}`);
  process.exit(1);
}

function validateEnv() {
  const { apiBase, siteUrl } = readViteEnv();
  const problems = [];

  if (!siteUrl) {
    problems.push('VITE_SITE_URL is required (https://your-live-site)');
  } else if (!siteUrl.startsWith('https://')) {
    problems.push('VITE_SITE_URL must use https://');
  } else if (PLACEHOLDER_RE.test(siteUrl)) {
    problems.push('VITE_SITE_URL must be the live website, not localhost or a placeholder');
  }

  if (!apiBase) {
    problems.push('VITE_API_BASE_URL is required');
  } else if (apiBase === '/api/v1') {
    // Same-origin only. Allowed when the API is reverse-proxied on the website host.
  } else {
    try {
      const url = new URL(apiBase);
      if (url.protocol !== 'https:') {
        problems.push('VITE_API_BASE_URL must be https:// or same-origin /api/v1');
      }
      if (url.username || url.password) {
        problems.push('VITE_API_BASE_URL must not include credentials');
      }
      if (PLACEHOLDER_RE.test(apiBase)) {
        problems.push('VITE_API_BASE_URL must be the live API, not localhost or a placeholder');
      }
      if (!url.pathname.endsWith('/api/v1')) {
        problems.push('VITE_API_BASE_URL should end with /api/v1');
      }
    } catch {
      problems.push('VITE_API_BASE_URL must be https://<host>/api/v1 or /api/v1');
    }
  }

  if (problems.length) fail(problems);
  return { apiBase, siteUrl };
}

function runNode(script, args) {
  if (!existsSync(script)) {
    fail([`Build tool not found: ${script}`]);
  }
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' },
  });
  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

function verifyDist() {
  if (!existsSync(join(distDir, 'index.html'))) {
    fail(['dist/index.html was not produced']);
  }

  const files = walk(distDir);
  const maps = files.filter((file) => file.endsWith('.map'));
  if (maps.length) {
    fail(['Source maps must not be emitted in production']);
  }

  const textFiles = files.filter((file) => ['.js', '.css', '.html'].includes(extname(file)));
  for (const file of textFiles) {
    const body = readFileSync(file, 'utf8');
    if (LEAK_RE.test(body)) {
      fail([`Production bundle must not contain secrets or source maps (${file.slice(root.length + 1)})`]);
    }
  }
}

const { apiBase, siteUrl } = validateEnv();
console.log(
  JSON.stringify(
    {
      mode: 'production',
      apiBase,
      siteUrl,
      sourcemap: false,
    },
    null,
    2,
  ),
);

runNode(join(root, 'node_modules/typescript/bin/tsc'), ['-b']);
runNode(join(root, 'node_modules/vite/bin/vite.js'), ['build', '--mode', 'production']);
verifyDist();
console.log('Production client build ready:', distDir.replace(/\\/g, '/'));
