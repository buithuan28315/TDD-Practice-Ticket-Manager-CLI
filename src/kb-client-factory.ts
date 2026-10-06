import { KBClient } from './kb';
import { HTTPKBClient } from './http-kb-client';
import { MockKBClient } from './mock-kb-client';

export function createKBClient(env: NodeJS.ProcessEnv = process.env): KBClient {
    const selectedClient = env.KB_CLIENT?.trim().toLowerCase() || 'mock';

    if (selectedClient === 'mock') {
        return new MockKBClient();
    }
    if (selectedClient === 'http') {
        return new HTTPKBClient(env.KB_API_URL ?? 'http://localhost:3000');
    }

    throw new Error('KB_CLIENT must be either "mock" or "http"');
}