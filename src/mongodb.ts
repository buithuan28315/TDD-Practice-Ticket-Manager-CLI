import {
    Collection,
    Db,
    Filter,
    MongoClient,
    Document as MongoDocument
} from 'mongodb';
import dotenv from 'dotenv';
import dns from 'dns';
import { Document, KBQuery, NewDocument } from './kb';

let dotenvLoaded = false;

function getRequiredEnv(name: string): string {
    if (!dotenvLoaded) {
        dotenv.config();
        dotenvLoaded = true;
    }

    const value = process.env[name];

    if (!value) {
        throw new Error(`${name} is required`);
    }

    return value;
}

interface KnowledgeDocument extends MongoDocument, Document {}
interface KBCounter extends MongoDocument {
    _id: string;
    value: number;
}

export function getHighestSequentialKBId(ids: readonly string[]): number {
    return ids.reduce((highest, id) => {
        const match = /^KB-(\d+)$/.exec(id);
        return match ? Math.max(highest, Number(match[1])) : highest;
    }, 0);
}

export function formatKBId(sequence: number): string {
    if (!Number.isSafeInteger(sequence) || sequence < 1) {
        throw new RangeError('KB ID sequence must be a positive safe integer');
    }

    return `KB-${String(sequence).padStart(3, '0')}`;
}

export function buildSearchFilter(
    query: string,
    filters?: KBQuery['filters']
): Filter<KnowledgeDocument> {
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const clauses: Filter<KnowledgeDocument>[] = [{
        $or: [
            { title: { $regex: escapedQuery, $options: 'i' } },
            { content: { $regex: escapedQuery, $options: 'i' } },
            { tags: { $regex: escapedQuery, $options: 'i' } }
        ]
    }];

    if (filters?.nodePath !== undefined) {
        clauses.push({ nodePath: filters.nodePath });
    }
    if (filters?.tags && filters.tags.length > 0) {
        clauses.push({ tags: { $in: filters.tags } });
    }

    return clauses.length === 1 ? clauses[0]! : { $and: clauses };
}

function isDuplicateKeyError(error: unknown): boolean {
    return typeof error === 'object' && error !== null &&
        'code' in error && error.code === 11000;
}

async function withCollection<T>(
    operation: (
        collection: Collection<KnowledgeDocument>,
        database: Db
    ) => Promise<T>
): Promise<T> {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    const client = new MongoClient(getRequiredEnv('MONGODB_URI'));
    try {
        await client.connect();
        const database = client.db(getRequiredEnv('MONGODB_DATABASE'));
        const collection = database.collection<KnowledgeDocument>(
            getRequiredEnv('MONGODB_COLLECTION')
        );
        return await operation(collection, database);
    } finally {
        await client.close();
    }
}

export async function testMongoDB(): Promise<void> {
    await withCollection(async (collection) => {
        console.log('MongoDB connected successfully');
        const document = await collection.findOne({
            id: 'KB-001'
        });
        console.log('Document:', document);
    });
}

export async function listDocuments(
    nodePath?: string,
    limit?: number
): Promise<KnowledgeDocument[]> {
    if (limit === 0) {
        return [];
    }

    return withCollection(async (collection) => {
        const filter = nodePath === undefined ? {} : { nodePath };
        const cursor = collection.find(filter);
        if (limit !== undefined) {
            cursor.limit(limit);
        }
        return cursor.toArray();
    });
}

export async function searchDocuments(
    query: string,
    topK?: number,
    filters?: KBQuery['filters']
): Promise<KnowledgeDocument[]> {
    if (topK === 0) {
        return [];
    }

    return withCollection(async (collection) => {
        const cursor = collection.find(buildSearchFilter(query, filters));
        if (topK !== undefined) {
            cursor.limit(topK);
        }
        return cursor.toArray();
    });
}

export async function retrieveDocument(docId: string): Promise<KnowledgeDocument | null> {
    return withCollection((collection) => collection.findOne({ id: docId }));
}

export async function addDocument(document: NewDocument): Promise<KnowledgeDocument> {
    return withCollection(async (collection, database) => {
        const existingIds = await collection
            .find({ id: /^KB-\d+$/ })
            .project<{ id: string }>({ id: 1 })
            .toArray();
        const highestExistingId = getHighestSequentialKBId(
            existingIds.map(({ id }) => id)
        );
        const counters = database.collection<KBCounter>('kb_counters');

        try {
            await counters.updateOne(
                { _id: 'kb-documents' },
                { $max: { value: highestExistingId } },
                { upsert: true }
            );
        } catch (error) {
            if (!isDuplicateKeyError(error)) {
                throw error;
            }
            await counters.updateOne(
                { _id: 'kb-documents' },
                { $max: { value: highestExistingId } }
            );
        }

        const counter = await counters.findOneAndUpdate(
            { _id: 'kb-documents' },
            { $inc: { value: 1 } },
            { returnDocument: 'after' }
        );
        if (!counter) {
            throw new Error('Failed to allocate the next KB document ID');
        }

        const created: KnowledgeDocument = {
            ...document,
            id: formatKBId(counter.value)
        };
        await collection.insertOne(created);
        return created;
    });
}