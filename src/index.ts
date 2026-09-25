import {
    listTicketsCommand,
    createTicketCommand,
    showTicketCommand,
    updateTicketCommand
} from './cli';

const args = process.argv.slice(2);

if (args[0] === 'tickets' && args[1] === 'create') {
    const tickets = listTicketsCommand();

    const nextNumber =
        tickets.length === 0
            ? 1
            : Math.max(
                ...tickets.map(ticket =>
                    Number(ticket.id.replace('TKT-', ''))
                )
            ) + 1;

    const ticket = createTicketCommand({
        id: `TKT-${String(nextNumber + 1).padStart(3, '0')}`,
        title: args[2],
        description: args[3],
        status: args[4],
        priority: args[5],
        tags: args[6]?.split(',') || [],
    });

    console.log(`
✓ Ticket created successfully

ID:          ${ticket.id}
Title:       ${ticket.title}
Description: ${ticket.description}
Status:      ${ticket.status}
Priority:    ${ticket.priority}
Tags:        ${ticket.tags.join(', ')}
`);
}