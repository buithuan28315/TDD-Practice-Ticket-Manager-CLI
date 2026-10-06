import {
    Document,
    KBClient,
    KBQuery,
    NewDocument,
    SearchResult
} from './kb';

function applyLimit<T>(items: T[], limit: number | undefined, name: string): T[] {
    if (limit === undefined) {
        return items;
    }

    if (!Number.isInteger(limit) || limit < 0) {
        throw new RangeError(`${name} must be a non-negative integer`);
    }

    return items.slice(0, limit);
}

export class MockKBClient implements KBClient {
    private documents: Document[] = [
        {
            id: 'KB-001',
            title: 'Login Error',
            content: 'Các bước xử lý khi người dùng gặp lỗi đăng nhập.',
            nodePath: '/technical/authentication',
            tags: ['login', 'authentication']
        },
        {
            id: 'KB-002',
            title: 'Password Reset',
            content: 'Hướng dẫn xử lý khi người dùng quên mật khẩu.',
            nodePath: '/technical/authentication',
            tags: ['password', 'login']
        },
        {
            id: 'KB-003',
            title: 'Customer Response Template',
            content: 'Template trả lời khách hàng khi xử lý yêu cầu hỗ trợ.',
            nodePath: '/templates/email',
            tags: ['template', 'email']
        }
    ];

    async search(query: KBQuery): Promise<SearchResult[]> {
        const keyword = query.query.toLowerCase();

        const results = this.documents
            .filter((document) => {
                const matchesNodePath =
                    query.filters?.nodePath === undefined ||
                    document.nodePath === query.filters.nodePath;
                const requestedTags = query.filters?.tags ?? [];
                const matchesTags =
                    requestedTags.length === 0 ||
                    requestedTags.some((tag) => document.tags.includes(tag));

                return (
                    matchesNodePath &&
                    matchesTags &&
                    (document.title.toLowerCase().includes(keyword) ||
                        document.content.toLowerCase().includes(keyword) ||
                        document.tags.some((tag) =>
                            tag.toLowerCase().includes(keyword)
                        ))
                );
            })
            .map((document) => ({
                document,
                matchType: 'text'
            }));

        return applyLimit(results, query.topK, 'topK');
    }

    async list(nodePath?: string, limit?: number): Promise<Document[]> {
        const results = nodePath === undefined
            ? this.documents
            : this.documents.filter((document) => document.nodePath === nodePath);

        return applyLimit(results, limit, 'limit');
    }

    async retrieve(docId: string): Promise<Document | null> {
        return this.documents.find((document) => document.id === docId) ?? null;
    }

    async add(document: NewDocument): Promise<Document> {
        const highestId = this.documents.reduce((highest, current) => {
            const match = /^KB-(\d+)$/.exec(current.id);
            return match ? Math.max(highest, Number(match[1])) : highest;
        }, 0);
        const addedDocument: Document = {
            ...document,
            id: `KB-${String(highestId + 1).padStart(3, '0')}`
        };

        this.documents.push(addedDocument);
        return addedDocument;
    }
}