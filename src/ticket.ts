function validateRequired(
    value: string | null | undefined,
    fieldName: string
) {
    if (!value?.trim()) {
        throw new Error(`${fieldName} is required`);
    }
}

function validateStatus(status: string) {
    if (status !== 'open' && status !== 'close') {
        throw new Error('Status must be open or close');
    }
}

function validatePriority(priority: string) {
    if (
        priority !== 'low' &&
        priority !== 'medium' &&
        priority !== 'high'
    ) {
        throw new Error('Priority must be low or medium or high');
    }
}

function validateTags(tags: string[]) {
    if (!Array.isArray(tags)) {
        throw new Error('Tags must be an array');
    }

    if (tags.some(tag => !tag?.trim())) {
        throw new Error('Tags cannot contain empty values');
    }
}

export function createTicket(data: any) {
    validateRequired(data.title, 'Title');
    validateRequired(data.description, 'Description');

    validateStatus(data.status);
    validatePriority(data.priority);
    validateTags(data.tags);

    return data;
}