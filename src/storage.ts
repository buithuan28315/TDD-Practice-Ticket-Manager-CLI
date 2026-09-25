import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(__dirname, '../data/tickets.json');

function writeTickets(tickets: any[]) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });

    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(tickets, null, 2),
        'utf-8'
    );
}

export function loadTickets(): any[] {
    if (!fs.existsSync(DATA_FILE)) {
        return [];
    }

    const data = fs.readFileSync(DATA_FILE, 'utf-8');

    if (!data.trim()) {
        return [];
    }

    return JSON.parse(data);
}

export function saveTicket(ticket: any) {
    const tickets = loadTickets();

    tickets.push(ticket);

    writeTickets(tickets);
}

export function listTickets(): any[] {
    return loadTickets();
}

export function showTicket(id: string) {
    const tickets = loadTickets();

    return tickets.find(ticket => ticket.id === id);
}

export function updateTicket(id: string, changes: any) {
    const tickets = loadTickets();

    const index = tickets.findIndex(ticket => ticket.id === id);

    if (index === -1) {
        return undefined;
    }

    tickets[index] = {
        ...tickets[index],
        ...changes,
    };

    writeTickets(tickets);

    return tickets[index];
}

export function clearTickets() {
    writeTickets([]);
}