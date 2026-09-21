import { createDefaultRestApp } from '@axc/rest';
import { Cellix } from '@cellix/api-core';
import { azureHonoHandler } from '@marplex/hono-azurefunc-adapter';

export const restApp = createDefaultRestApp();

export function registerFunctions(): Promise<unknown> {
	return Cellix.initializeInfrastructureServices(() => {
		// Healthcheck does not register infrastructure services yet.
		// Future Mongoose services from @axc/service-mongoose are registered here.
	})
		.setContext(() => ({}))
		.initializeApplicationServices(() => ({
			forRequest: () => Promise.resolve({}),
		}))
		.registerAzureFunctionHttpHandler('health', { authLevel: 'anonymous', methods: ['GET'], route: 'health' }, () => azureHonoHandler((request) => restApp.fetch(request)))
		.startUp();
}
