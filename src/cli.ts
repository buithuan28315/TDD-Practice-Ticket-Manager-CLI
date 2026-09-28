import { createTicket } from './ticket';
import { Ticket, TicketInput } from './ticket';
import { TicketChanges, TicketList } from './storage';
import {
    saveTicket,
    listTickets,
    showTicket,
    updateTicket
} from './storage';

export interface TicketFilters {
    status?: string;
    priority?: string;
    tags?: string;
}

export function createTicketCommand(data: TicketInput): Ticket {
    const ticket = createTicket(data);

    saveTicket(ticket);

    return ticket;
}

export function listTicketsCommand(filters?: TicketFilters): TicketList {
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

    return result as TicketList;
}

export function showTicketCommand(id: string): Ticket | undefined {
    return showTicket(id);
}

export function updateTicketCommand(
    id: string,
    changes: TicketChanges
): Ticket | undefined {
    return updateTicket(id, changes);
}