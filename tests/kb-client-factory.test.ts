import { createKBClient } from '../src/kb-client-factory';
import { HTTPKBClient } from '../src/http-kb-client';
import { MockKBClient } from '../src/mock-kb-client';

describe('createKBClient', () => {
    test('uses mock when KB_CLIENT is unset or mock', () => {
        expect(createKBClient({})).toBeInstanceOf(MockKBClient);
        expect(createKBClient({ KB_CLIENT: 'mock' })).toBeInstanceOf(MockKBClient);
    });

    test('uses HTTP client and configured API URL when selected', () => {
        const client = createKBClient({
            KB_CLIENT: 'http',
            KB_API_URL: 'http://127.0.0.1:4321'
        });

        expect(client).toBeInstanceOf(HTTPKBClient);
    });

    test('rejects an unsupported client selection', () => {
        expect(() => createKBClient({ KB_CLIENT: 'database' })).toThrow(
            'KB_CLIENT must be either "mock" or "http"'
        );
    });
});