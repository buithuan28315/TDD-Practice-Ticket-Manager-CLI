import { createTicket } from './ticket';
import {
    saveTicket,
    listTickets,
    showTicket, 
    updateTicket
} from './storage';

export function createTicketCommand(data: any) {
    const ticket = createTicket(data);

    saveTicket(ticket);

    return ticket;
}

export function listTicketsCommand(filters?: any) {
    const tickets = listTickets();

    if (!filters) {
        return tickets;
    }

    let result = tickets;

    if (filters.status) {
        result = result.filter(
            ticket => ticket.status === filters.status
        );
    }

    if (filters.priority) {
        result = result.filter(
            ticket => ticket.priority === filters.priority
        );
    }

    if (filters.tags) {
        result = result.filter(
            ticket => ticket.tags.includes(filters.tags)
        );
    }

    return result;
}

export function showTicketCommand(id: string) {
    return showTicket(id);
}

export function updateTicketCommand(id: string, changes: any) {
    return updateTicket(id, changes);
}