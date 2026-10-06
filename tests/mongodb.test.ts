import { formatKBId, getHighestSequentialKBId } from '../src/mongodb';

describe('MongoDB KB document IDs', () => {
    test('finds the highest numeric ID and ignores non-sequential IDs', () => {
        expect(getHighestSequentialKBId([
            'KB-001',
            'KB-014',
            'KB-c704680b-5215-40dc-8679-6253751f92a5',
            'doc-100'
        ])).toBe(14);
    });

    test('formats sequential IDs with at least three digits', () => {
        expect(formatKBId(1)).toBe('KB-001');
        expect(formatKBId(14)).toBe('KB-014');
        expect(formatKBId(1000)).toBe('KB-1000');
    });
});