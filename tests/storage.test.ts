import { clearTickets, loadTickets, saveTicket } from '../src/storage';
import { Ticket } from '../src/ticket';
import fs from 'fs';
import os from 'os';
import path from 'path';

const TEMP_DIRECTORY = fs.mkdtempSync(
    path.join(os.tmpdir(), 'ticket-manager-')
);
const DATA_FILE = path.join(TEMP_DIRECTORY, 'tickets.json');

describe('storage', () => {
    beforeEach(() => {
        clearTickets(DATA_FILE);
    });

    afterAll(() => {
        fs.rmSync(TEMP_DIRECTORY, {
            recursive: true,
            force: true,
        });
    });

    it('should save and load tickets', () => {
        const ticket: Ticket = {
            id: 'TKT-001',
            title: 'Fix login bug',
            description: 'Users cannot login',
            status: 'open',
            priority: 'high',
            tags: ['bug'],
        };

        saveTicket(ticket, DATA_FILE);

        expect(loadTickets(DATA_FILE)).toEqual([ticket]);
    });



    it('should throw error when JSON is corrupted', () => {
        fs.writeFileSync(DATA_FILE, 'invalid json', 'utf-8');

        expect(() => {
            loadTickets(DATA_FILE);
        }).toThrow();
    });

    it('should return empty array when JSON file does not exist', () => {
        if (fs.existsSync(DATA_FILE)) {
            fs.unlinkSync(DATA_FILE);
        }

        expect(loadTickets(DATA_FILE)).toEqual([]);
    });
});