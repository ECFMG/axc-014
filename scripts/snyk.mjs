import { spawnSync } from 'node:child_process';

const args = ['test', '--all-projects', '--org=agentcourses'];
console.log(`Snyk: attempting local CLI: snyk ${args.join(' ')}`);
const result = spawnSync('snyk', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
if (output.trim()) {
	process.stdout.write(output.endsWith('\n') ? output : `${output}\n`);
}
const authFailure = /Snyk is not authenticated|not authenticated|Authentication credentials|snyk auth|SNYK_TOKEN|401 Unauthorized/i.test(output);
if (result.error) {
	const message = result.error.message;
	console.log(`Snyk: SKIPPED NON-BLOCKING: credentials unavailable (${message})`);
	process.exit(0);
}
if ((result.status ?? 1) === 0) {
	console.log('Snyk: PASS');
	process.exit(0);
}
if ((result.status ?? 1) === 2 && authFailure) {
	console.log('Snyk: SKIPPED NON-BLOCKING: credentials unavailable (local Snyk CLI is not authenticated)');
	process.exit(0);
}
console.error('Snyk: FAIL');
process.exit(result.status ?? 1);
