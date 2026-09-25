import {
    createTicketCommand,
    listTicketsCommand,
    showTicketCommand
} from '../src/cli';

import { clearTickets } from '../src/storage';

describe('cli', () => {

    beforeEach(() => {
        clearTickets();
    });

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

    it('should list tickets', () => {
        createTicketCommand({
            id: 'TKT-001',
            title: 'Fix login bug',
            description: 'Users cannot login',
            status: 'open',
            priority: 'high',
            tags: ['bug'],
        });

        const tickets = listTicketsCommand();

        expect(tickets).toHaveLength(1);
        expect(tickets[0].id).toBe('TKT-001');
    });

    it('should show a ticket', () => {
        createTicketCommand({
            id: 'TKT-001',
            title: 'Fix login bug',
            description: 'Users cannot login',
            status: 'open',
            priority: 'high',
            tags: ['bug'],
        });

        const ticket = showTicketCommand('TKT-001');

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