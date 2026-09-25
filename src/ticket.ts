export function createTicket(data: any) {
    if (!data.title?.trim()) {
        throw new Error('Title is required');
    }

    if (!data.description?.trim()) {
        throw new Error('Description is required');
    }

    return data;
}