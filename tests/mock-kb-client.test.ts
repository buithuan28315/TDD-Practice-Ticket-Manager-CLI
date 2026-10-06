import { MockKBClient } from '../src/mock-kb-client';

describe('MockKBClient', () => {
    test('search returns matching documents', async () => {
        const client = new MockKBClient();

        const results = await client.search({
            query: 'login',
            topK: 3
        });

        expect(results.length).toBeGreaterThan(0);

        expect(results[0].document.title).toBe('Login Error');
    });
});