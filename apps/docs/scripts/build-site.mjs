import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const docsRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const healthMarkdown = readFileSync(join(docsRoot, 'docs/healthcheck.md'), 'utf8');
const decisionsMarkdown = readFileSync(join(docsRoot, 'docs/decisions.md'), 'utf8');
const outDir = join(docsRoot, 'build');
mkdirSync(outDir, { recursive: true });

function page(title, markdown) {
	const body = markdown
		.replace(/^---[\s\S]*?---\n/, '')
		.replace(/^# .+\n/, '')
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;');
	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
</head>
<body>
<main>
<h1>${title}</h1>
<pre>${body}</pre>
</main>
</body>
</html>
`;
}

writeFileSync(join(outDir, 'index.html'), page('Healthcheck', healthMarkdown));
writeFileSync(join(outDir, 'decisions.html'), page('Decision records', decisionsMarkdown));
const index = readFileSync(join(outDir, 'index.html'), 'utf8');
if (!index.includes('"service": "agentCourses-api"') || !index.includes('"projectCode": "axc"')) {
	console.error('Docs build did not include the health contract');
	process.exit(1);
}
console.log('Wrote Docusaurus content pages to apps/docs/build');
