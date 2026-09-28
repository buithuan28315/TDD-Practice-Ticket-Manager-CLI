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
        const tags = filters.tags
            .split(',')
            .map((tag: string) => tag.trim())
            .filter((tag: string) => tag);

        result = result.filter(ticket =>
            tags.some((tag: string) =>
                ticket.tags.includes(tag)
            )
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