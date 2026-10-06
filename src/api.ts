import express from 'express';
import { Document, NewDocument } from './kb';
import {
    addDocument,
    listDocuments,
    retrieveDocument,
    searchDocuments
} from './mongodb';

export interface KBRepository {
    searchDocuments(query: string, topK?: number): Promise<Document[]>;
    listDocuments(nodePath?: string, limit?: number): Promise<Document[]>;
    retrieveDocument(docId: string): Promise<Document | null>;
    addDocument(document: NewDocument): Promise<Document>;
}

const mongoRepository: KBRepository = {
    searchDocuments,
    listDocuments,
    retrieveDocument,
    addDocument
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonNegativeInteger(value: unknown): value is number {
    return Number.isSafeInteger(value) && (value as number) >= 0;
}

function sendBadRequest(res: express.Response, message: string): void {
    res.status(400).json({ error: message });
}

export function createApi(repository: KBRepository = mongoRepository): express.Express {
    const app = express();
    app.use(express.json());

    app.post('/search', async (req, res) => {
        const body: unknown = req.body;
        if (!isRecord(body) || typeof body.query !== 'string' || !body.query.trim()) {
            sendBadRequest(res, 'query must be a non-empty string');
            return;
        }
        if (body.topK !== undefined && !isNonNegativeInteger(body.topK)) {
            sendBadRequest(res, 'topK must be a non-negative integer');
            return;
        }

        try {
            const documents = body.topK === 0
                ? []
                : await repository.searchDocuments(body.query, body.topK as number | undefined);
            res.status(200).json({
                results: documents.map(({ id, title, nodePath }) => ({ id, title, nodePath }))
            });
        } catch {
            res.status(500).json({ error: 'Failed to search documents' });
        }
    });

    app.post('/list', async (req, res) => {
        const body: unknown = req.body ?? {};
        if (!isRecord(body)) {
            sendBadRequest(res, 'request body must be an object');
            return;
        }
        if (body.nodePath !== undefined && typeof body.nodePath !== 'string') {
            sendBadRequest(res, 'nodePath must be a string');
            return;
        }
        if (body.limit !== undefined && !isNonNegativeInteger(body.limit)) {
            sendBadRequest(res, 'limit must be a non-negative integer');
            return;
        }

        try {
            const documents = body.limit === 0
                ? []
                : await repository.listDocuments(
                    body.nodePath as string | undefined,
                    body.limit as number | undefined
                );
            res.status(200).json(documents);
        } catch {
            res.status(500).json({ error: 'Failed to list documents' });
        }
    });

    app.post('/retrieve', async (req, res) => {
        const body: unknown = req.body;
        if (!isRecord(body) || typeof body.docId !== 'string' || !body.docId.trim()) {
            sendBadRequest(res, 'docId must be a non-empty string');
            return;
        }

        try {
            const document = await repository.retrieveDocument(body.docId);
            if (!document) {
                res.status(404).json({ error: 'Document not found' });
                return;
            }
            res.status(200).json(document);
        } catch {
            res.status(500).json({ error: 'Failed to retrieve document' });
        }
    });

    app.post('/add', async (req, res) => {
        const body: unknown = req.body;
        if (
            !isRecord(body) ||
            typeof body.title !== 'string' || !body.title.trim() ||
            typeof body.content !== 'string' || !body.content.trim() ||
            typeof body.nodePath !== 'string' || !body.nodePath.trim() ||
            !Array.isArray(body.tags) ||
            !body.tags.every((tag: unknown) => typeof tag === 'string')
        ) {
            sendBadRequest(res, 'title, content, nodePath, and string tags are required');
            return;
        }

        try {
            const document = await repository.addDocument({
                title: body.title,
                content: body.content,
                nodePath: body.nodePath,
                tags: body.tags
            });
            res.status(201).json(document);
        } catch {
            res.status(500).json({ error: 'Failed to add document' });
        }
    });

    return app;
}

const app = createApi();

export default app;