import { execSync } from 'child_process';
import fs from 'fs';

const DATA_FILE = 'data/tickets.json';

describe('CLI', () => {
    beforeEach(() => {
        fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
    });

    it('should create a ticket from CLI', () => {
        const output = execSync(
            'npx tsx src/index.ts tickets create "Fix login bug" "Users cannot login" open high bug,login'
        ).toString();

        expect(output).toContain('Ticket created successfully');
        expect(output).toContain('TKT-001');
        expect(output).toContain('Fix login bug');
    });


    it('should list tickets from CLI', () => {
        fs.writeFileSync(
            DATA_FILE,
            JSON.stringify([
                {
                    id: 'TKT-002',
                    title: 'Fix login bug',
                    description: 'Users cannot login',
                    status: 'open',
                    priority: 'high',
                    tags: ['bug', 'login'],
                },
            ]),
            'utf-8'
        );

        const output = execSync(
            'npx tsx src/index.ts tickets list'
        ).toString();

        expect(output).toContain('TKT-002');
        expect(output).toContain('Fix login bug');
        expect(output).toContain('open');
        expect(output).toContain('high');
    });


    it('should show a ticket from CLI', () => {
        fs.writeFileSync(
            DATA_FILE,
            JSON.stringify([
                {
                    id: 'TKT-003',
                    title: 'Fix login bug',
                    description: 'Users cannot login',
                    status: 'open',
                    priority: 'high',
                    tags: ['bug', 'login'],
                },
            ]),
            'utf-8'
        );

        const output = execSync(
            'npm run cli -- tickets show TKT-003'
        ).toString();

        expect(output).toContain('TKT-003');
        expect(output).toContain('Fix login bug');
        expect(output).toContain('Users cannot login');
        expect(output).toContain('open');
        expect(output).toContain('high');
        expect(output).toContain('bug, login');
    });

    it('should show a ticket when id is case-insensitive', () => {
        fs.writeFileSync(
            DATA_FILE,
            JSON.stringify([
                {
                    id: 'TKT-003',
                    title: 'Fix login bug',
                    description: 'Users cannot login',
                    status: 'open',
                    priority: 'high',
                    tags: ['bug', 'login'],
                },
            ]),
            'utf-8'
        );

        const output = execSync(
            'npm run cli -- tickets show tkt-003'
        ).toString();

        expect(output).toContain('TKT-003');
        expect(output).toContain('Fix login bug');
    });


    it('should update ticket status from CLI', () => {
        fs.writeFileSync(
            DATA_FILE,
            JSON.stringify([
                {
                    id: 'TKT-003',
                    title: 'Fix login bug',
                    description: 'Users cannot login',
                    status: 'open',
                    priority: 'high',
                    tags: ['bug', 'login'],
                },
            ]),
            'utf-8'
        );

        const output = execSync(
            'npm run cli -- tickets update tkt-003 close'
        ).toString();

        expect(output).toContain('Ticket updated successfully');
        expect(output).toContain('TKT-003');
        expect(output).toContain('close');
    });

    
});