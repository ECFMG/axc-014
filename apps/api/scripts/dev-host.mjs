import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyWorktreeSuffix } from '@cellix/local-dev/urls';

const apiDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = join(apiDir, '../..');
const worktreeName = process.env.WORKTREE_NAME || basename(repoRoot);
const hostname = applyWorktreeSuffix('axc.localhost', worktreeName);
const serveJs = join(apiDir, 'dist/serve.js');
const children = [];

process.env.AXC_ENVIRONMENT ??= 'local';
process.env.AXC_LOCAL_RUNTIME = '1';

console.log(`AXC portless hostname: https://${hostname}/health`);
console.log(`AXC worktree: ${worktreeName}`);

const tsc = spawn('pnpm', ['exec', 'tsc', '-b', '--watch', '--preserveWatchOutput', '--pretty', 'false'], {
	cwd: apiDir,
	stdio: ['ignore', 'pipe', 'inherit'],
	env: process.env,
});
children.push(tsc);
tsc.stdout.on('data', (chunk) => {
	process.stdout.write(chunk);
});

await waitForFile(serveJs);

const portless = spawn('pnpm', ['exec', 'portless', hostname, '--force', 'node', '--watch', 'dist/serve.js'], {
	cwd: apiDir,
	stdio: 'inherit',
	env: process.env,
});
children.push(portless);

const stop = (signal) => {
	for (const child of children) {
		child.kill(signal);
	}
};
process.on('SIGINT', () => stop('SIGINT'));
process.on('SIGTERM', () => stop('SIGTERM'));

portless.on('exit', (code) => {
	stop('SIGTERM');
	process.exit(code ?? 0);
});

function waitForFile(path) {
	return new Promise((resolve, reject) => {
		const started = Date.now();
		const timer = setInterval(() => {
			if (existsSync(path)) {
				clearInterval(timer);
				resolve();
				return;
			}
			if (Date.now() - started > 120000) {
				clearInterval(timer);
				reject(new Error(`Timed out waiting for ${path}`));
			}
		}, 200);
	});
}
