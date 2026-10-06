import { MongoClient, Document } from 'mongodb';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

dns.setServers(['8.8.8.8', '8.8.4.4']);

function getRequiredEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`${name} is required`);
    }

    return value;
}

const uri = getRequiredEnv('MONGODB_URI');
const databaseName = getRequiredEnv('MONGODB_DATABASE');
const collectionName = getRequiredEnv('MONGODB_COLLECTION');

interface KnowledgeDocument extends Document {
    _id: string;
    title: string;
    content: string;
    nodePath: string;
    tags: string[];
}

const client = new MongoClient(uri);

export async function testMongoDB(): Promise<void> {
    try {
        await client.connect();

        console.log('MongoDB connected successfully');

        const database = client.db(databaseName);

        const collection =
            database.collection<KnowledgeDocument>(collectionName);

        const document = await collection.findOne({
            _id: 'KB-001'
        });

        console.log('Document:', document);
    } finally {
        await client.close();
    }
}