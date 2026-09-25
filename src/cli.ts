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

export function listTicketsCommand() {
    return listTickets();
}

export function showTicketCommand(id: string) {
    return showTicket(id);
}