import express from 'express';
import { listDocuments } from './mongodb';

const app = express();

app.use(express.json());

app.get('/list', async (_req, res) => {
    try {
        const documents = await listDocuments();

        res.status(200).json(documents);
    } catch (error) {
        console.error('Failed to list documents:', error);

        res.status(500).json({
            error: 'Failed to list documents'
        });
    }
});

export default app;