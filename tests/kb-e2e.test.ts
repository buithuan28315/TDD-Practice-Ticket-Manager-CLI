import { createServer } from 'http';
import { createApi, KBRepository } from '../src/api';
import { HTTPKBClient } from '../src/http-kb-client';
import { Document } from '../src/kb';
import { runKBCommand } from '../src/kb-cli';

describe('KB CLI to HTTP API integration', () => {
    test('passes CLI search filters through HTTP and API to the repository', async () => {
        const documents: Document[] = [
            {
                id: 'KB-001',
                title: 'Login Error',
                content: 'Resolve login errors',
                nodePath: '/technical/authentication',
                tags: ['login', 'authentication']
            },
            {
                id: 'KB-002',
                title: 'Login Template',
                content: 'A login response template',
                nodePath: '/templates/email',
                tags: ['login', 'template']
            }
        ];
        const repository: KBRepository = {
            searchDocuments: jest.fn(async (query, topK, filters) => {
                const matches = documents.filter((document) =>
                    (document.title.toLowerCase().includes(query.toLowerCase()) ||
                        document.content.toLowerCase().includes(query.toLowerCase()) ||
                        document.tags.some((tag) =>
                            tag.toLowerCase().includes(query.toLowerCase()))) &&
                    (filters?.nodePath === undefined ||
                        document.nodePath === filters.nodePath) &&
                    (!filters?.tags?.length ||
                        filters.tags.some((tag) => document.tags.includes(tag)))
                );
                return topK === undefined ? matches : matches.slice(0, topK);
            }),
            listDocuments: jest.fn(async () => documents),
            retrieveDocument: jest.fn(async (id) =>
                documents.find((document) => document.id === id) ?? null),
            addDocument: jest.fn(async (document) => ({
                ...document,
                id: 'KB-003'
            }))
        };
        const server = createServer(createApi(repository));
        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));

        const address = server.address();
        if (!address || typeof address === 'string') {
            throw new Error('Expected the integration test server to use a TCP port');
        }
        const client = new HTTPKBClient(
            `http://127.0.0.1:${address.port}`
        );
        const log = jest.spyOn(console, 'log').mockImplementation(() => undefined);

        try {
            await runKBCommand([
                'search',
                'login',
                '--node',
                '/technical/authentication',
                '--tags',
                'login',
                '--top-k',
                '2'
            ], client);

            expect(repository.searchDocuments).toHaveBeenCalledWith(
                'login',
                2,
                {
                    nodePath: '/technical/authentication',
                    tags: ['login']
                }
            );
            expect(log).toHaveBeenCalledWith(
                'KB-001 | Login Error | /technical/authentication'
            );
            expect(log).not.toHaveBeenCalledWith(
                'KB-002 | Login Template | /templates/email'
            );
        } finally {
            log.mockRestore();
            await new Promise<void>((resolve, reject) => {
                server.close((error) => error ? reject(error) : resolve());
            });
        }
    });
});
