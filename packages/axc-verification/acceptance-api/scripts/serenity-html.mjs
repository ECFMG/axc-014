import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const reportDir = join(packageDir, 'target/site/serenity');
const scenarioTitle = 'GET /health returns the agentCourses health contract';
const outcomes = listJson(reportDir).filter((file) => {
	const text = readFileSync(file, 'utf8');
	return text.includes(scenarioTitle) && text.includes('"result":"SUCCESS"');
});
if (outcomes.length === 0) {
	console.error('Serenity outcome JSON for the passed GET /health scenario was not written');
	process.exit(1);
}
console.log(`${outcomes.length} Serenity scenario${outcomes.length === 1 ? '' : 's'} passed, including ${scenarioTitle}`);

const result = spawnSync('pnpm', ['exec', 'serenity-bdd', 'run', '--source', reportDir, '--destination', reportDir], { cwd: packageDir, encoding: 'utf8' });
process.stdout.write(result.stdout ?? '');
process.stderr.write(result.stderr ?? '');
if ((result.status ?? 1) !== 0) {
	console.error('serenity-bdd run failed');
	process.exit(result.status ?? 1);
}

const indexPath = join(reportDir, 'index.html');
const html = existsSync(indexPath) ? readFileSync(indexPath, 'utf8') : '';
const countsZeroTests = /test-count-title[\s\S]{0,120}0 tests/.test(html);
if (!html.includes(scenarioTitle) || countsZeroTests) {
	console.error('Serenity HTML report does not include the passed GET /health scenario');
	process.exit(1);
}
console.log(`Serenity HTML report: ${indexPath}`);

function listJson(dir, files = []) {
	if (!existsSync(dir)) {
		return files;
	}
	for (const name of readdirSync(dir)) {
		const path = join(dir, name);
		if (statSync(path).isDirectory()) {
			listJson(path, files);
		} else if (name.endsWith('.json')) {
			files.push(path);
		}
	}
	return files;
}
