function validateRequired(
    value: string | null | undefined,
    fieldName: string
) {
    if (!value?.trim()) {
        throw new Error(`${fieldName} is required`);
    }
}

export function createTicket(data: any) {
    validateRequired(data.title, 'Title');
    validateRequired(data.description, 'Description');

    return data;
}