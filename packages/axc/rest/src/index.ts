import { buildHealthStatus, type HealthStatus, resolveHealthEnvironment } from '@axc/application-services';
import { Hono } from 'hono';

export interface RestDependencies {
	getHealth: () => HealthStatus;
}

export function createRestApp(dependencies: RestDependencies): Hono {
	const app = new Hono();
	app.get('/health', (context) => context.json(dependencies.getHealth()));
	return app;
}

export function createDefaultRestApp(env: Readonly<Record<string, string | undefined>> = process.env): Hono {
	return createRestApp({
		getHealth: () => buildHealthStatus({ environment: resolveHealthEnvironment(env) }),
	});
}
