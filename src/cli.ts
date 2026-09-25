import { createTicket } from './ticket';
import {
    saveTicket,
    listTickets,
    showTicket
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

    if (filters.status) {
        return tickets.filter(
            ticket => ticket.status === filters.status
        );
    }

    if (filters.priority) {
        return tickets.filter(
            ticket => ticket.priority === filters.priority
        );
    }

    if (filters.tags) {
        return tickets.filter(
            ticket => ticket.tags.includes(filters.tags)
        );
    }

    return tickets;
}

export function showTicketCommand(id: string) {
    return showTicket(id);
}