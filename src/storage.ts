import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(__dirname, '../data/tickets.json');

export function saveTicket(ticket: any) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });

    let tickets: any[] = [];

    if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');

        if (data.trim()) {
            tickets = JSON.parse(data);
        }
    }

    tickets.push(ticket);

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

export function clearTickets() {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });

    fs.writeFileSync(
        DATA_FILE,
        '[]',
        'utf-8'
    );
}