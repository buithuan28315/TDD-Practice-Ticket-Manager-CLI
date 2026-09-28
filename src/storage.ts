import fs from 'fs';
import path from 'path';
import { Ticket } from './ticket';

export interface TicketChanges {
    status?: string;
}

export type TicketList = Ticket[] & {
    [index: number]: Ticket;
};

const DATA_FILE = path.join(__dirname, '../data/tickets.json');

function writeTickets(tickets: Ticket[]): void {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });

    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(tickets, null, 2),
        'utf-8'
    );
}

export function loadTickets(): TicketList {
    if (!fs.existsSync(DATA_FILE)) {
        return [] as TicketList;
    }

    const data = fs.readFileSync(DATA_FILE, 'utf-8');

    if (!data.trim()) {
        return [] as TicketList;
    }

    return JSON.parse(data) as TicketList;
}

export function saveTicket(ticket: Ticket): void {
    const tickets = loadTickets();

    tickets.push(ticket);

    writeTickets(tickets);
}

export function listTickets(): TicketList {
    return loadTickets();
}

export function showTicket(id: string): Ticket | undefined {
    const tickets = loadTickets();

    return tickets.find(ticket => ticket.id === id);
}

export function updateTicket(
    id: string,
    changes: TicketChanges
): Ticket | undefined {
    const tickets = loadTickets();

    const index = tickets.findIndex(ticket => ticket.id === id);

    if (index === -1) {
        return undefined;
    }

    tickets[index] = {
        ...tickets[index],
        ...changes,
    } as Ticket;

    writeTickets(tickets);

    return tickets[index];
}

export function clearTickets() {
    writeTickets([]);
}