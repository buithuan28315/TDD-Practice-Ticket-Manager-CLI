import { createTicket } from './ticket';
import {
    saveTicket,
    listTickets
} from './storage';

export function createTicketCommand(data: any) {
    const ticket = createTicket(data);

    saveTicket(ticket);

    return ticket;
}

export function listTicketsCommand() {
    return listTickets();
}

export function showTicketCommand() {
}