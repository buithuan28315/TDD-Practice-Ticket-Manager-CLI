import { clearTickets, loadTickets, saveTicket } from '../src/storage';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(
    process.cwd(),
    'data',
    'tickets.json'
);

describe('storage', () => {
    beforeEach(() => {
        clearTickets();
    });

    it('should save and load tickets', () => {
        const ticket = {
            id: 'TKT-001',
            title: 'Fix login bug',
            description: 'Users cannot login',
            status: 'open',
            priority: 'high',
            tags: ['bug'],
        };

        saveTicket(ticket);

        expect(loadTickets()).toEqual([ticket]);
    });



    it('should throw error when JSON is corrupted', () => {
        fs.writeFileSync(DATA_FILE, 'invalid json', 'utf-8');

        try {
            expect(() => {
                loadTickets();
            }).toThrow();
        } finally {
            fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
        }
    });

    it('should return empty array when JSON file does not exist', () => {
        if (fs.existsSync(DATA_FILE)) {
            fs.unlinkSync(DATA_FILE);
        }

        try {
            expect(loadTickets()).toEqual([]);
        } finally {
            fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
        }
    });
});