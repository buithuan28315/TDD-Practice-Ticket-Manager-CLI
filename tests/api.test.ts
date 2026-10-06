import request from 'supertest';
import { createApi, KBRepository } from '../src/api';
import { Document } from '../src/kb';

const document: Document = {
    id: 'KB-001',
    title: 'Login Error',
    content: 'Steps to resolve login errors',
    nodePath: '/technical/authentication',
    tags: ['login', 'authentication']
};

const repository: jest.Mocked<KBRepository> = {
    searchDocuments: jest.fn(),
    listDocuments: jest.fn(),
    retrieveDocument: jest.fn(),
    addDocument: jest.fn()
};

const app = createApi(repository);

describe('KB API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('POST /search returns contract search summaries and applies topK', async () => {
        repository.searchDocuments.mockResolvedValue([document]);

        const response = await request(app)
            .post('/search')
            .send({ query: 'login', topK: 2 });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            results: [{
                id: 'KB-001',
                title: 'Login Error',
                nodePath: '/technical/authentication'
            }]
        });
        expect(repository.searchDocuments).toHaveBeenCalledWith('login', 2);
    });

    test('POST /list passes nodePath and limit to storage', async () => {
        repository.listDocuments.mockResolvedValue([document]);

        const response = await request(app)
            .post('/list')
            .send({ nodePath: '/technical/authentication', limit: 1 });

        expect(response.status).toBe(200);
        expect(response.body).toEqual([document]);
        expect(repository.listDocuments).toHaveBeenCalledWith(
            '/technical/authentication',
            1
        );
    });

    test('POST /list with limit zero returns no documents without querying storage', async () => {
        const response = await request(app)
            .post('/list')
            .send({ limit: 0 });

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
        expect(repository.listDocuments).not.toHaveBeenCalled();
    });

    test('POST /retrieve returns a matching document or 404', async () => {
        repository.retrieveDocument.mockResolvedValueOnce(document).mockResolvedValueOnce(null);

        const foundResponse = await request(app)
            .post('/retrieve')
            .send({ docId: 'KB-001' });
        const missingResponse = await request(app)
            .post('/retrieve')
            .send({ docId: 'KB-404' });

        expect(foundResponse.status).toBe(200);
        expect(foundResponse.body).toEqual(document);
        expect(missingResponse.status).toBe(404);
        expect(missingResponse.body).toEqual({ error: 'Document not found' });
    });

    test('POST /add stores a valid document and returns its generated ID', async () => {
        const createdDocument = { ...document, id: 'KB-new-id' };
        repository.addDocument.mockResolvedValue(createdDocument);
        const newDocument = {
            title: document.title,
            content: document.content,
            nodePath: document.nodePath,
            tags: document.tags
        };

        const response = await request(app)
            .post('/add')
            .send(newDocument);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(createdDocument);
        expect(repository.addDocument).toHaveBeenCalledWith(newDocument);
    });

    test('KB endpoints reject missing or invalid input', async () => {
        const searchResponse = await request(app).post('/search').send({ topK: -1 });
        const retrieveResponse = await request(app).post('/retrieve').send({});
        const addResponse = await request(app).post('/add').send({
            title: 'Missing tags',
            content: 'Content',
            nodePath: '/docs',
            tags: 'not-an-array'
        });

        expect(searchResponse.status).toBe(400);
        expect(retrieveResponse.status).toBe(400);
        expect(addResponse.status).toBe(400);
    });
});