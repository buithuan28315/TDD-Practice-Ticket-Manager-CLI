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

    if (data.status !== 'open' && data.status !== 'close') {
        throw new Error('Status must be open or close');
    }

    if (
        data.priority !== 'low' &&
        data.priority !== 'medium' &&
        data.priority !== 'high'
    ) {
        throw new Error('Priority must be low or medium or high');
    }

    if (!Array.isArray(data.tags)) {
        throw new Error('Tags must be an array');
    }

    if (data.tags.some((tag: string) => !tag?.trim())) {
        throw new Error('Tags cannot contain empty values');
    }

    return data;
}