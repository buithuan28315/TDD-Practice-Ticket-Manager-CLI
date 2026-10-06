import { MockKBClient } from '../src/mock-kb-client';

describe('MockKBClient', () => {
    // Tìm kiếm nội dung và trả về tài liệu có từ khóa khớp.
    test('search returns matching documents', async () => {
        const client = new MockKBClient();

        const results = await client.search({
            query: 'login',
            topK: 3
        });

        expect(results.length).toBeGreaterThan(0);

        const firstResult = results[0];

        expect(firstResult).toBeDefined();
        expect(firstResult!.document.title).toBe('Login Error');
    });

    // Lọc tag theo kiểu OR và giới hạn số kết quả bằng topK.
    test('search applies any matching tag and topK filters', async () => {
        const client = new MockKBClient();

        const results = await client.search({
            query: 'login',
            filters: {
                tags: ['password', 'authentication']
            },
            topK: 1
        });

        expect(results).toHaveLength(1);
        expect(results[0]?.document.id).toBe('KB-001');
    });

    // Chỉ tìm trong nodePath khớp chính xác.
    test('search filters by exact nodePath', async () => {
        const client = new MockKBClient();

        const results = await client.search({
            query: 'login',
            filters: { nodePath: '/templates/email' }
        });

        expect(results).toEqual([]);
    });

    // topK bằng 0 phải trả về danh sách rỗng.
    test('search with topK zero returns no results', async () => {
        const client = new MockKBClient();

        await expect(client.search({ query: 'login', topK: 0 })).resolves.toEqual([]);
    });

    // Liệt kê đúng các tài liệu thuộc nodePath được yêu cầu.
    test('list filters by exact nodePath', async () => {
        const client = new MockKBClient();

        const results = await client.list('/technical/authentication');

        expect(results.map((document) => document.id)).toEqual(['KB-001', 'KB-002']);
    });

    // Áp dụng limit sau khi lọc theo nodePath.
    test('list applies limit to filtered documents', async () => {
        const client = new MockKBClient();

        const results = await client.list('/technical/authentication', 1);

        expect(results).toHaveLength(1);
        expect(results[0]?.id).toBe('KB-001');
    });

    // limit bằng 0 phải trả về danh sách rỗng.
    test('list with limit zero returns no documents', async () => {
        const client = new MockKBClient();

        await expect(client.list(undefined, 0)).resolves.toEqual([]);
    });

    // Từ chối limit âm vì đây không phải giới hạn hợp lệ.
    test('list rejects a negative limit', async () => {
        const client = new MockKBClient();

        await expect(client.list(undefined, -1)).rejects.toThrow(RangeError);
    });

    // Trả tài liệu khi tìm thấy và null khi không có ID tương ứng.
    test('retrieve returns a document or null when it does not exist', async () => {
        const client = new MockKBClient();

        await expect(client.retrieve('KB-002')).resolves.toMatchObject({
            title: 'Password Reset'
        });
        await expect(client.retrieve('missing')).resolves.toBeNull();
    });

    // Tự tạo ID tăng tuần tự và lưu tài liệu để truy xuất/liệt kê lại.
    test('add generates sequential IDs and stores the document', async () => {
        const client = new MockKBClient();
        const newDocument = {
            title: 'SMS Template',
            content: 'A short message template.',
            nodePath: '/templates/sms',
            tags: ['template', 'sms']
        };

        const firstAdded = await client.add(newDocument);
        const secondAdded = await client.add(newDocument);

        expect(firstAdded.id).toBe('KB-004');
        expect(secondAdded.id).toBe('KB-005');
        await expect(client.retrieve('KB-004')).resolves.toEqual(firstAdded);
        await expect(client.list('/templates/sms')).resolves.toHaveLength(2);
    });
});