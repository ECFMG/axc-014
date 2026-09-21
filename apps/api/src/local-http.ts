import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';

interface FetchApp {
	fetch(request: Request): Promise<Response> | Response;
}

export function startLocalHttpServer(app: FetchApp): void {
	const port = Number(process.env['PORT'] ?? '7071');
	const server = createServer((request, response) => {
		void forward(app, request, response);
	});
	server.listen(port, '0.0.0.0', () => {
		console.log(`agentCourses-api listening on ${port}`);
	});
}

async function forward(app: FetchApp, request: IncomingMessage, response: ServerResponse): Promise<void> {
	const host = request.headers.host ?? '127.0.0.1';
	const url = new URL(request.url ?? '/', `http://${host}`);
	const headers = new Headers();
	for (const [key, value] of Object.entries(request.headers)) {
		if (typeof value === 'string') {
			headers.set(key, value);
		} else if (Array.isArray(value)) {
			headers.set(key, value.join(', '));
		}
	}
	const method = request.method ?? 'GET';
	const upstream = new Request(url, { method, headers });
	const result = await app.fetch(upstream);
	const body = Buffer.from(await result.arrayBuffer());
	result.headers.forEach((value, key) => {
		if (key.toLowerCase() !== 'content-length') {
			response.setHeader(key, value);
		}
	});
	response.statusCode = result.status;
	response.end(body);
}
