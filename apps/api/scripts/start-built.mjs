import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const apiDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const bundle = join(apiDir, 'deploy/dist/index.js');
if (!existsSync(bundle)) {
	console.error('Built API bundle is missing. Run pnpm run build before pnpm run start.');
	process.exit(1);
}

process.env.AXC_LOCAL_RUNTIME = '1';
process.env.AXC_ENVIRONMENT ??= 'local';
process.env.PORT ??= '7071';
console.log(`AXC local runtime serving the Rolldown bundle at http://127.0.0.1:${process.env.PORT}/health`);
await import(bundle);
