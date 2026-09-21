import { describe, expect, it } from 'vitest';
import { createDefaultRestApp, createRestApp } from './index.ts';

describe('GET /health', () => {
	it('returns the injected health contract', async () => {
		const app = createRestApp({
			getHealth: () => ({
				status: 'ok',
				service: 'agentCourses-api',
				projectCode: 'axc',
				environment: 'test',
				timestamp: '2026-09-21T15:04:05.000Z',
			}),
		});
		const response = await app.request('/health');
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({
			status: 'ok',
			service: 'agentCourses-api',
			projectCode: 'axc',
			environment: 'test',
			timestamp: '2026-09-21T15:04:05.000Z',
		});
	});

	it('reads the running mode from the composed environment', async () => {
		const app = createDefaultRestApp({ AXC_ENVIRONMENT: 'production' });
		const response = await app.request('/health');
		const body = (await response.json()) as { status: string; service: string; projectCode: string; environment: string; timestamp: string };
		expect(response.status).toBe(200);
		expect(body.status).toBe('ok');
		expect(body.service).toBe('agentCourses-api');
		expect(body.projectCode).toBe('axc');
		expect(body.environment).toBe('production');
		expect(Number.isNaN(Date.parse(body.timestamp))).toBe(false);
	});
});
