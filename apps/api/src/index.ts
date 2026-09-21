import { registerFunctions, restApp } from './composition.ts';
import { startLocalHttpServer } from './local-http.ts';

await registerFunctions();

if (process.env['AXC_LOCAL_RUNTIME'] === '1') {
	startLocalHttpServer(restApp);
}
