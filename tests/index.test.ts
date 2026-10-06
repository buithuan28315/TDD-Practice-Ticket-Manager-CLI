import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(
    process.cwd(),
    'data',
    'tickets.json'
);

function runCliExpectingFailure(command: string): string {
    try {
        execSync(`npm run cli -- ${command}`, { encoding: 'utf-8' });
    } catch (error) {
        const failure = error as { stdout?: string; stderr?: string };
        return `${failure.stdout ?? ''}${failure.stderr ?? ''}`;
    }

    throw new Error(`Expected CLI command to fail: ${command}`);
}

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

    it('should filter tickets by status from CLI', () => {
        fs.writeFileSync(
            DATA_FILE,
            JSON.stringify([
                {
                    id: 'TKT-020',
                    title: 'Open ticket',
                    description: 'This ticket is open',
                    status: 'open',
                    priority: 'high',
                    tags: ['bug'],
                },
                {
                    id: 'TKT-021',
                    title: 'Closed ticket',
                    description: 'This ticket is closed',
                    status: 'close',
                    priority: 'high',
                    tags: ['bug'],
                },
            ]),
            'utf-8'
        );

        const output = execSync(
            'npm run cli -- tickets list --status open'
        ).toString();

        expect(output).toContain('TKT-020');
        expect(output).not.toContain('TKT-021');
    });


    it('should filter tickets by priority from CLI', () => {
        fs.writeFileSync(
            DATA_FILE,
            JSON.stringify([
                {
                    id: 'TKT-030',
                    title: 'High priority ticket',
                    description: 'High priority',
                    status: 'open',
                    priority: 'high',
                    tags: ['bug'],
                },
                {
                    id: 'TKT-031',
                    title: 'Low priority ticket',
                    description: 'Low priority',
                    status: 'open',
                    priority: 'low',
                    tags: ['bug'],
                },
            ]),
            'utf-8'
        );

        const output = execSync(
            'npm run cli -- tickets list --priority high'
        ).toString();

        expect(output).toContain('TKT-030');
        expect(output).not.toContain('TKT-031');
    });


    it('should filter tickets by tag from CLI', () => {
        fs.writeFileSync(
            DATA_FILE,
            JSON.stringify([
                {
                    id: 'TKT-040',
                    title: 'Bug ticket',
                    description: 'Login bug',
                    status: 'open',
                    priority: 'high',
                    tags: ['bug', 'login'],
                },
                {
                    id: 'TKT-041',
                    title: 'Feature ticket',
                    description: 'New feature',
                    status: 'open',
                    priority: 'high',
                    tags: ['feature'],
                },
            ]),
            'utf-8'
        );

        const output = execSync(
            'npm run cli -- tickets list --tag bug'
        ).toString();

        expect(output).toContain('TKT-040');
        expect(output).not.toContain('TKT-041');
    });

    it('should filter tickets by multiple filters from CLI', () => {
        fs.writeFileSync(
            DATA_FILE,
            JSON.stringify([
                {
                    id: 'TKT-050',
                    title: 'Matching ticket',
                    description: 'Should match all filters',
                    status: 'open',
                    priority: 'high',
                    tags: ['bug', 'login'],
                },
                {
                    id: 'TKT-051',
                    title: 'Wrong priority',
                    description: 'Should not match',
                    status: 'open',
                    priority: 'low',
                    tags: ['bug'],
                },
                {
                    id: 'TKT-052',
                    title: 'Wrong status',
                    description: 'Should not match',
                    status: 'close',
                    priority: 'high',
                    tags: ['bug'],
                },
            ]),
            'utf-8'
        );

        const output = execSync(
            'npm run cli -- tickets list --status open --priority high --tag bug'
        ).toString();

        expect(output).toContain('TKT-050');
        expect(output).not.toContain('TKT-051');
        expect(output).not.toContain('TKT-052');
    });

    it('should filter tickets by multiple tags from CLI', () => {
        fs.writeFileSync(
            DATA_FILE,
            JSON.stringify([
                {
                    id: 'TKT-060',
                    title: 'Bug login',
                    description: 'Login bug',
                    status: 'open',
                    priority: 'high',
                    tags: ['bug', 'login'],
                },
                {
                    id: 'TKT-061',
                    title: 'Bug only',
                    description: 'Another bug',
                    status: 'open',
                    priority: 'low',
                    tags: ['bug'],
                },
                {
                    id: 'TKT-062',
                    title: 'Feature',
                    description: 'New feature',
                    status: 'open',
                    priority: 'low',
                    tags: ['feature'],
                },
            ]),
            'utf-8'
        );

        const output = execSync(
            'npm run cli -- tickets list --tag bug,login'
        ).toString();

        expect(output).toContain('TKT-060');
        expect(output).toContain('TKT-061');
        expect(output).not.toContain('TKT-062');
    });

    it('should search KB documents from CLI', () => {
        const output = execSync(
            'npm run cli -- kb search response --top-k 2'
        ).toString();

        expect(output).toContain('Search results:');
        expect(output).toContain('KB-003');
        expect(output).toContain('Customer Response Template');
        expect(output).toContain('/templates/email');
    });

    it('should list KB documents with node and limit options from CLI', () => {
        const output = execSync(
            'npm run cli -- kb list --node /technical/authentication --limit 1'
        ).toString();

        expect(output).toContain('KB-001');
        expect(output).not.toContain('KB-002');
    });

    it('should retrieve a KB document from CLI', () => {
        const output = execSync(
            'npm run cli -- kb retrieve KB-002'
        ).toString();

        expect(output).toContain('KB-002');
        expect(output).toContain('Password Reset');
        expect(output).toContain('quên mật khẩu');
    });

    it('should add a KB document from a file through CLI', () => {
        const filePath = path.join(process.cwd(), 'data', 'cli-kb-add-test.md');
        fs.writeFileSync(filePath, 'Nội dung mẫu SMS.', 'utf-8');

        try {
            const output = execSync(
                `npm run cli -- kb add --file "${filePath}" --path /templates/sms --title "SMS Template" --tags sms,template`
            ).toString();

            expect(output).toContain('Document added successfully');
            expect(output).toContain('KB-004');
            expect(output).toContain('SMS Template');
            expect(output).toContain('Nội dung mẫu SMS.');
        } finally {
            fs.rmSync(filePath, { force: true });
        }
    });

    it('should report missing KB command input and return a failure status', () => {
        const output = runCliExpectingFailure('kb retrieve');

        expect(output).toContain('Usage: kb retrieve <doc-id>');
    });

    it('should reject invalid search limits and unknown KB documents', () => {
        const invalidLimitOutput = runCliExpectingFailure(
            'kb search login --top-k many'
        );
        const missingDocumentOutput = runCliExpectingFailure(
            'kb retrieve KB-999'
        );

        expect(invalidLimitOutput).toContain('--top-k must be a non-negative integer');
        expect(missingDocumentOutput).toContain('Document not found: KB-999');
    });
});