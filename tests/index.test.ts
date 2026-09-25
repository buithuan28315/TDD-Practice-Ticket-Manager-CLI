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
});