import { AddressInfo } from 'net';
import { createServer, ServerResponse } from 'http';
import { HTTPKBClient } from '../src/http-kb-client';

type RequestHandler = (
    path: string,
    body: unknown,
    response: ServerResponse
) => void;

async function withFakeServer<T>(
    handler: RequestHandler,
    run: (client: HTTPKBClient) => Promise<T>
): Promise<T> {
    const server = createServer(async (request, response) => {
        let rawBody = '';
        for await (const chunk of request) {
            rawBody += chunk.toString();
        }

        handler(
            request.url ?? '',
            rawBody ? JSON.parse(rawBody) as unknown : undefined,
            response
        );
    });

    await new Promise<void>((resolve) => {
        server.listen(0, '127.0.0.1', resolve);
    });

    const address = server.address() as AddressInfo;
    const client = new HTTPKBClient(`http://127.0.0.1:${address.port}`);
    try {
        return await run(client);
    } finally {
        await new Promise<void>((resolve, reject) => {
            server.close((error) => error ? reject(error) : resolve());
        });
    }
}

function sendJson(response: ServerResponse, status: number, payload: unknown): void {
    response.writeHead(status, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(payload));
}

describe('HTTPKBClient', () => {
    test('sends contract requests and parses all four responses', async () => {
        const requests: Array<{ path: string; body: unknown }> = [];
        const document = {
            id: 'KB-007',
            title: 'Password Reset',
            content: 'Reset instructions',
            nodePath: '/technical/authentication',
            tags: ['password']
        };

        const outputs = await withFakeServer((path, body, response) => {
            requests.push({ path, body });
            if (path === '/search') {
                sendJson(response, 200, {
                    results: [{ id: document.id, title: document.title, nodePath: document.nodePath }]
                });
            } else if (path === '/list') {
                sendJson(response, 200, [document]);
            } else if (path === '/retrieve') {
                sendJson(response, 200, document);
            } else if (path === '/add') {
                sendJson(response, 201, { ...body as object, id: 'KB-008' });
            } else {
                sendJson(response, 404, { error: 'Not found' });
            }
        }, async (client) => ({
            search: await client.search({
                query: 'password',
                topK: 3,
                filters: {
                    nodePath: document.nodePath,
                    tags: ['password']
                }
            }),
            list: await client.list(document.nodePath, 5),
            retrieved: await client.retrieve(document.id),
            added: await client.add({
                title: 'New article',
                content: 'New content',
                nodePath: '/docs',
                tags: ['new']
            })
        }));

        expect(outputs.search[0]?.document).toEqual({
            id: document.id,
            title: document.title,
            nodePath: document.nodePath
        });
        expect(outputs.list).toEqual([document]);
        expect(outputs.retrieved).toEqual(document);
        expect(outputs.added.id).toBe('KB-008');
        expect(requests).toEqual([
            {
                path: '/search',
                body: {
                    query: 'password',
                    topK: 3,
                    filters: {
                        nodePath: document.nodePath,
                        tags: ['password']
                    }
                }
            },
            { path: '/list', body: { nodePath: document.nodePath, limit: 5 } },
            { path: '/retrieve', body: { docId: document.id } },
            {
                path: '/add',
                body: {
                    title: 'New article',
                    content: 'New content',
                    nodePath: '/docs',
                    tags: ['new']
                }
            }
        ]);
    });

    test('returns null when retrieve responds with 404', async () => {
        await withFakeServer((_path, _body, response) => {
            sendJson(response, 404, { error: 'Document not found' });
        }, async (client) => {
            await expect(client.retrieve('missing')).resolves.toBeNull();
        });
    });

    test('reports HTTP status and API error message', async () => {
        await withFakeServer((_path, _body, response) => {
            sendJson(response, 503, { error: 'Service unavailable' });
        }, async (client) => {
            await expect(client.list()).rejects.toThrow(
                'KB API returned HTTP 503: Service unavailable'
            );
        });
    });

    test('reports invalid JSON responses', async () => {
        await withFakeServer((_path, _body, response) => {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end('{invalid');
        }, async (client) => {
            await expect(client.search({ query: 'test' })).rejects.toThrow(
                'KB API returned invalid JSON for POST /search'
            );
        });
    });

    test('reports malformed JSON response shapes', async () => {
        await withFakeServer((_path, _body, response) => {
            sendJson(response, 200, { results: [{ id: 'KB-001' }] });
        }, async (client) => {
            await expect(client.search({ query: 'test' })).rejects.toThrow(
                'KB API returned an invalid search result'
            );
        });
    });

});