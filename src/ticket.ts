export function createTicket(data: any) {
    if (!data.title?.trim()) {
        throw new Error('Title is required');
    }

    return data;
}