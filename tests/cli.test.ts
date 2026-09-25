import {
    createTicketCommand,
    listTicketsCommand,
    showTicketCommand,
    updateTicketCommand
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

    it('should list tickets by priority', () => {
        const ticket1 = {
            id: 'TKT-006',
            title: 'High priority ticket',
            description: 'This is high priority',
            status: 'open',
            priority: 'high',
            tags: ['bug'],
        };

        const ticket2 = {
            id: 'TKT-007',
            title: 'Low priority ticket',
            description: 'This is low priority',
            status: 'open',
            priority: 'low',
            tags: ['feature'],
        };

        createTicketCommand(ticket1);
        createTicketCommand(ticket2);

        const result = listTicketsCommand({
            priority: 'high',
        });

        expect(result).toEqual([ticket1]);
    });

    it('should list tickets by tags', () => {
        const ticket1 = {
            id: 'TKT-008',
            title: 'Login bug',
            description: 'Login is broken',
            status: 'open',
            priority: 'high',
            tags: ['bug', 'login'],
        };

        const ticket2 = {
            id: 'TKT-009',
            title: 'New feature',
            description: 'Add new feature',
            status: 'open',
            priority: 'low',
            tags: ['feature'],
        };

        createTicketCommand(ticket1);
        createTicketCommand(ticket2);

        const result = listTicketsCommand({
            tags: 'bug',
        });

        expect(result).toEqual([ticket1]);
    });

    it('should update ticket status', () => {
        const ticket = {
            id: 'TKT-011',
            title: 'Login bug',
            description: 'Users cannot login',
            status: 'open',
            priority: 'high',
            tags: ['bug'],
        };

        createTicketCommand(ticket);

        const result = updateTicketCommand('TKT-011', {
            status: 'close',
        });

        expect(result.status).toBe('close');
    });
});