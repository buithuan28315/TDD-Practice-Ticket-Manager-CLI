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

// Tạo ticket hợp lệ, lưu lại và trả về kết quả.
export function createTicketCommand(data: TicketInput): Ticket {
    const ticket = createTicket(data);

    saveTicket(ticket);

    return ticket;
}

// Lấy danh sách ticket và lọc theo trạng thái, ưu tiên hoặc thẻ.
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

// Tìm ticket theo mã định danh.
export function showTicketCommand(id: string): Ticket | undefined {
    return showTicket(id);
}

// Cập nhật ticket theo mã định danh và các thay đổi được cung cấp.
export function updateTicketCommand(
    id: string,
    changes: TicketChanges
): Ticket | undefined {
    return updateTicket(id, changes);
}