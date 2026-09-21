import { createServer } from 'node:net';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ProcessTestServer } from '@cellix/serenity-framework';

const apiDirectory = join(dirname(fileURLToPath(import.meta.url)), '../../../../apps/api');

let port = 0;
let server: ProcessTestServer | undefined;

export const infrastructure = {
	async ensureStarted(): Promise<void> {
		if (server?.isRunning()) {
			return;
		}
		port = await reservePort();
		process.env['PORT'] = String(port);
		process.env['AXC_ENVIRONMENT'] = 'test';
		process.env['AXC_LOCAL_RUNTIME'] = '1';
		server = new ProcessTestServer({
			serverName: 'agentCourses-api',
			executable: process.execPath,
			spawnArgs: ['dist/serve.js'],
			cwd: apiDirectory,
			readyMarker: /agentCourses-api listening/,
			url: `http://127.0.0.1:${port}/health`,
			startupTimeoutMs: 60_000,
		});
		await server.start();
	},
	getState(): { baseUrl: string } {
		return { baseUrl: `http://127.0.0.1:${port}` };
	},
	async stopAll(): Promise<void> {
		await server?.stop();
	},
};

function reservePort(): Promise<number> {
	return new Promise((resolve, reject) => {
		const probe = createServer();
		probe.once('error', reject);
		probe.listen(0, '127.0.0.1', () => {
			const address = probe.address();
			if (address === null || typeof address === 'string') {
				probe.close();
				reject(new Error('Could not reserve a port'));
				return;
			}
			const reserved = address.port;
			probe.close((error) => {
				if (error) {
					reject(error);
				} else {
					resolve(reserved);
				}
			});
		});
	});
}
