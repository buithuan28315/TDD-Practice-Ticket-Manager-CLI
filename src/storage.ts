import fs from 'fs';
import path from 'path';
import { createTicket, Ticket } from './ticket';

export interface TicketChanges {
    status?: string;
}

export type TicketList = Ticket[] & {
    [index: number]: Ticket;
};

const DATA_FILE = path.join(__dirname, '../data/tickets.json');

function writeTickets(
    tickets: Ticket[],
    dataFile: string
): void {
    fs.mkdirSync(path.dirname(dataFile), { recursive: true });

    fs.writeFileSync(
        dataFile,
        JSON.stringify(tickets, null, 2),
        'utf-8'
    );
}

export function loadTickets(dataFile = DATA_FILE): TicketList {
    if (!fs.existsSync(dataFile)) {
        return [] as TicketList;
    }

    const data = fs.readFileSync(dataFile, 'utf-8');

    if (!data.trim()) {
        return [] as TicketList;
    }

    return JSON.parse(data) as TicketList;
}

export function saveTicket(
    ticket: Ticket,
    dataFile = DATA_FILE
): void {
    const tickets = loadTickets(dataFile);

    tickets.push(ticket);

    writeTickets(tickets, dataFile);
}

export function listTickets(dataFile = DATA_FILE): TicketList {
    return loadTickets(dataFile);
}

export function showTicket(
    id: string,
    dataFile = DATA_FILE
): Ticket | undefined {
    const tickets = loadTickets(dataFile);

    return tickets.find(ticket => ticket.id === id);
}

export function updateTicket(
    id: string,
    changes: TicketChanges,
    dataFile = DATA_FILE
): Ticket | undefined {
    const tickets = loadTickets(dataFile);

    const index = tickets.findIndex(ticket => ticket.id === id);

    if (index === -1) {
        return undefined;
    }

    const updatedTicket = createTicket({
        ...tickets[index],
        ...changes,
    });

    tickets[index] = updatedTicket;

    writeTickets(tickets, dataFile);

    return updatedTicket;
}

export function clearTickets(dataFile = DATA_FILE): void {
    writeTickets([], dataFile);
}