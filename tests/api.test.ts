import request from 'supertest';
import app from '../src/api';

describe('KB API', () => {
    test('GET /list returns documents', async () => {
        const response = await request(app)
            .get('/list');

        expect(response.status).toBe(200);

        expect(Array.isArray(response.body)).toBe(true);

        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: 'KB-001',
                    title: 'Login Error'
                })
            ])
        );
    });
});