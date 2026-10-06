export interface Document {
    id: string;
    title: string;
    content: string;
    nodePath: string;
    tags: string[];
}

export type NewDocument = Omit<Document, 'id'>;

export interface SearchResult {
    document: Document;
    matchType: string;
}

export interface KBQuery {
    query: string;
    filters?: {
        nodePath?: string;
        tags?: string[];
    };
    topK?: number;
}

export interface KBClient {
    search(query: KBQuery): Promise<SearchResult[]>;

    list(
        nodePath?: string,
        limit?: number
    ): Promise<Document[]>;

    retrieve(docId: string): Promise<Document | null>;

    add(document: NewDocument): Promise<Document>;
}