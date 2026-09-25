import { createTicketCommand } from '../src/cli';

describe('cli', () => {

    it('should create a ticket', () => {
        const ticket = createTicketCommand({
            id: 'TKT-001',
            title: 'Fix login bug',
            description: 'Users cannot login',
            status: 'open',
            priority: 'high',
            tags: ['bug'],
        });

        expect(ticket).toEqual({
            id: 'TKT-001',
            title: 'Fix login bug',
            description: 'Users cannot login',
            status: 'open',
            priority: 'high',
            tags: ['bug'],
        });
    });

});