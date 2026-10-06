import request from 'supertest';

describe('KB API', () => {
    test('GET /list returns documents', async () => {
        const response = await request('http://localhost:3000')
            .get('/list');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});