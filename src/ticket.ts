export type TicketStatus = 'open' | 'close';
export type TicketPriority = 'low' | 'medium' | 'high';

export interface Ticket {
    id?: string;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    tags: string[];
}

export interface TicketInput {
    id?: string;
    title?: string | undefined;
    description?: string | undefined;
    status?: string | undefined;
    priority?: string | undefined;
    tags?: string[] | undefined;
}
// Kiểm tra giá trị bắt buộc không rỗng.
function validateRequired(
    value: string | null | undefined,
    fieldName: string
) {
    if (!value?.trim()) {
        throw new Error(`${fieldName} is required`);
    }
}

// Kiểm tra trạng thái có thuộc các giá trị được hỗ trợ.
function validateStatus(status: string) {
    if (status !== 'open' && status !== 'close') {
        throw new Error('Status must be open or close');
    }
}

// Kiểm tra mức độ ưu tiên có hợp lệ.
function validatePriority(priority: string) {
    if (
        priority !== 'low' &&
        priority !== 'medium' &&
        priority !== 'high'
    ) {
        throw new Error('Priority must be low or medium or high');
    }
}

// Kiểm tra danh sách thẻ hợp lệ và không có phần tử rỗng.
function validateTags(tags: string[] | undefined) {
    if (!Array.isArray(tags)) {
        throw new Error('Tags must be an array');
    }

    if (tags.some(tag => !tag?.trim())) {
        throw new Error('Tags cannot contain empty values');
    }
}

// Xác thực dữ liệu đầu vào và tạo một ticket.
export function createTicket(data: TicketInput): Ticket {
    validateRequired(data.title, 'Title');
    validateRequired(data.description, 'Description');

    validateStatus(data.status ?? '');
    validatePriority(data.priority ?? '');
    validateTags(data.tags);

    return {
        ...(data.id === undefined ? {} : { id: data.id }),
        title: data.title as string,
        description: data.description as string,
        status: data.status as TicketStatus,
        priority: data.priority as TicketPriority,
        tags: data.tags as string[],
    };
}