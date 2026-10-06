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

// Ghi toàn bộ danh sách ticket vào tệp dữ liệu.
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

// Đọc danh sách ticket từ tệp, hoặc trả về danh sách rỗng nếu chưa có dữ liệu.
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

// Thêm ticket mới vào danh sách và lưu xuống tệp.
export function saveTicket(
    ticket: Ticket,
    dataFile = DATA_FILE
): void {
    const tickets = loadTickets(dataFile);

    tickets.push(ticket);

    writeTickets(tickets, dataFile);
}

// Trả về toàn bộ danh sách ticket đã lưu.
export function listTickets(dataFile = DATA_FILE): TicketList {
    return loadTickets(dataFile);
}

// Tìm và trả về ticket theo mã định danh.
export function showTicket(
    id: string,
    dataFile = DATA_FILE
): Ticket | undefined {
    const tickets = loadTickets(dataFile);

    return tickets.find(ticket => ticket.id === id);
}

// Cập nhật ticket theo mã và lưu thay đổi xuống tệp.
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

// Xóa toàn bộ ticket đã lưu.
export function clearTickets(dataFile = DATA_FILE): void {
    writeTickets([], dataFile);
}