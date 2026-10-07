import {
    Document,
    DocumentSummary,
    KBClient,
    KBQuery,
    NewDocument,
    SearchResult
} from './kb';

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isDocumentSummary(value: unknown): value is DocumentSummary {
    return isRecord(value) &&
        typeof value.id === 'string' &&
        typeof value.title === 'string' &&
        typeof value.nodePath === 'string';
}

function isDocument(value: unknown): value is Document {
    if (!isRecord(value) || !isDocumentSummary(value)) {
        return false;
    }

    const record = value as Record<string, unknown>;
    return typeof record.content === 'string' &&
        Array.isArray(record.tags) &&
        record.tags.every((tag: unknown) => typeof tag === 'string');
}

function errorMessage(payload: unknown): string | undefined {
    if (!isRecord(payload)) {
        return undefined;
    }

    if (typeof payload.error === 'string') {
        return payload.error;
    }
    if (typeof payload.message === 'string') {
        return payload.message;
    }
    return undefined;
}

export class HTTPKBClient implements KBClient {
    private readonly baseUrl: string;

    constructor(baseUrl = process.env.KB_API_URL ?? 'http://localhost:3000') {
        let parsedUrl: URL;
        try {
            parsedUrl = new URL(baseUrl);
        } catch {
            throw new Error('KB_API_URL must be a valid HTTP(S) URL');
        }

        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
            throw new Error('KB_API_URL must use HTTP or HTTPS');
        }

        this.baseUrl = parsedUrl.toString().replace(/\/+$/, '');
    }

    private async post(
        endpoint: string,
        body: unknown,
        allowNotFound = false
    ): Promise<unknown> {
        let response: Response;
        try {
            response = await fetch(`${this.baseUrl}/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
        } catch (error) {
            const detail = error instanceof Error ? error.message : 'Unknown network error';
            throw new Error(`KB API request failed for POST /${endpoint}: ${detail}`);
        }

        let payload: unknown;
        try {
            payload = await response.json();
        } catch {
            if (allowNotFound && response.status === 404) {
                return undefined;
            }
            if (!response.ok) {
                throw new Error(`KB API returned HTTP ${response.status} for POST /${endpoint} with invalid JSON`);
            }
            throw new Error(`KB API returned invalid JSON for POST /${endpoint}`);
        }

        if (allowNotFound && response.status === 404) {
            return undefined;
        }
        if (!response.ok) {
            const detail = errorMessage(payload);
            throw new Error(
                detail
                    ? `KB API returned HTTP ${response.status}: ${detail}`
                    : `KB API returned HTTP ${response.status} for POST /${endpoint}`
            );
        }

        return payload;
    }

    async search(query: KBQuery): Promise<SearchResult[]> {
        const payload = await this.post('search', {
            query: query.query,
            ...(query.topK !== undefined ? { topK: query.topK } : {}),
            ...(query.filters !== undefined ? { filters: query.filters } : {})
        });

        if (!isRecord(payload) || !Array.isArray(payload.results)) {
            throw new Error('KB API returned an invalid response for POST /search: expected a results array');
        }
        if (!payload.results.every(isDocumentSummary)) {
            throw new Error('KB API returned an invalid search result: expected id, title, and nodePath');
        }

        return payload.results.map((document) => ({ document }));
    }

    async list(nodePath?: string, limit?: number): Promise<Document[]> {
        const payload = await this.post('list', {
            ...(nodePath !== undefined ? { nodePath } : {}),
            ...(limit !== undefined ? { limit } : {})
        });

        if (!Array.isArray(payload) || !payload.every(isDocument)) {
            throw new Error('KB API returned an invalid response for POST /list: expected a document array');
        }

        return payload;
    }

    async retrieve(docId: string): Promise<Document | null> {
        const payload = await this.post('retrieve', { docId }, true);
        if (payload === undefined) {
            return null;
        }
        if (!isDocument(payload)) {
            throw new Error('KB API returned an invalid response for POST /retrieve: expected a document');
        }

        return payload;
    }

    async add(document: NewDocument): Promise<Document> {
        const payload = await this.post('add', document);
        if (!isDocument(payload)) {
            throw new Error('KB API returned an invalid response for POST /add: expected a document');
        }

        return payload;
    }
}