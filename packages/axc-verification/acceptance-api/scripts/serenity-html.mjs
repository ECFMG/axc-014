import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const attempts = [['run'], ['run', '--destination', 'target/site/serenity'], ['run', '--source', 'target/site/serenity', '--destination', 'target/site/serenity']];

for (const args of attempts) {
	const result = spawnSync('pnpm', ['exec', 'serenity-bdd', ...args], { cwd: packageDir, encoding: 'utf8' });
	process.stdout.write(result.stdout ?? '');
	process.stderr.write(result.stderr ?? '');
	const report = findIndexHtml(join(packageDir, 'target'));
	if (report) {
		console.log(`Serenity HTML report: ${report}`);
		process.exit(0);
	}
}

console.error('Serenity HTML report was not generated');
process.exit(1);

function findIndexHtml(dir) {
	if (!existsSync(dir)) {
		return undefined;
	}
	for (const name of readdirSync(dir)) {
		const path = join(dir, name);
		if (statSync(path).isDirectory()) {
			const nested = findIndexHtml(path);
			if (nested) {
				return nested;
			}
		} else if (name === 'index.html') {
			return path;
		}
	}
	return undefined;
}
