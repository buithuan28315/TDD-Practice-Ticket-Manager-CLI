import { clearTickets, loadTickets, saveTicket } from '../src/storage';

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
});