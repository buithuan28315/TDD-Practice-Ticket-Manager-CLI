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

    it('should list tickets by status', () => {
        const ticket1 = {
            id: 'TKT-004',
            title: 'Open ticket',
            description: 'This ticket is open',
            status: 'open',
            priority: 'high',
            tags: ['bug'],
        };

        const ticket2 = {
            id: 'TKT-005',
            title: 'Closed ticket',
            description: 'This ticket is closed',
            status: 'close',
            priority: 'medium',
            tags: ['bug'],
        };

        createTicketCommand(ticket1);
        createTicketCommand(ticket2);

        const result = listTicketsCommand({
            status: 'open',
        });

        expect(result).toEqual([ticket1]);
    });
});