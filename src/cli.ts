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

    let result = tickets;

    return result;
}

export function showTicketCommand(id: string) {
    return showTicket(id);
}