import {
    listTicketsCommand,
    createTicketCommand,
    showTicketCommand,
    updateTicketCommand
} from './cli';
import { createKBClient } from './kb-client-factory';
import { runKBCommand } from './kb-cli';

const args = process.argv.slice(2);

if (args[0] === 'kb') {
    void (async () => {
        try {
            await runKBCommand(args.slice(1), createKBClient());
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.error(message);
            process.exitCode = 1;
        }
    })();
}

if (args[0] === 'tickets' && args[1] === 'create') {
    const tickets = listTicketsCommand();

    const nextNumber =
        tickets.length === 0
            ? 1
            : Math.max(
                // Chuyển hậu tố mã ticket thành số để tìm mã tiếp theo.
                ...tickets.map(ticket =>
                    Number(ticket.id?.replace('TKT-', '') ?? 0)
                )
            ) + 1;

    const ticket = createTicketCommand({
        id: `TKT-${String(nextNumber).padStart(3, '0')}`,
        title: args[2] ?? '',
        description: args[3] ?? '',
        status: args[4] ?? '',
        priority: args[5] ?? '',
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

if (args[0] === 'tickets' && args[1] === 'list') {
    const statusIndex = args.indexOf('--status');
    const priorityIndex = args.indexOf('--priority');
    const tagIndex = args.indexOf('--tag');

    const filters = {
        ...(statusIndex !== -1
            ? { status: args[statusIndex + 1] }
            : {}),
        ...(priorityIndex !== -1
            ? { priority: args[priorityIndex + 1] }
            : {}),
        ...(tagIndex !== -1
            ? { tags: args[tagIndex + 1] }
            : {}),
    };

    const tickets = listTicketsCommand(
        Object.keys(filters).length > 0 ? filters : undefined
    );

    console.log('\nTickets:\n');

    // In thông tin tóm tắt của từng ticket.
    tickets.forEach(ticket => {
        console.log(
            `${ticket.id} | ${ticket.title} | ${ticket.status} | ${ticket.priority} | ${ticket.tags.join(', ')}`
        );
    });

    console.log('');
}

if (args[0] === 'tickets' && args[1] === 'show') {
    const ticketId = args[2];

    if (!ticketId) {
        console.log('Ticket ID is required');
    } else {
        const ticket = showTicketCommand(ticketId.toUpperCase());

        if (!ticket) {
            console.log('Ticket not found');
        } else {
            console.log(`
Ticket details

ID:          ${ticket.id}
Title:       ${ticket.title}
Description: ${ticket.description}
Status:      ${ticket.status}
Priority:    ${ticket.priority}
Tags:        ${ticket.tags.join(', ')}
`);
        }
    }
}

if (args[0] === 'tickets' && args[1] === 'update') {
    const ticketId = args[2];
    const status = args[3];

    if (!ticketId) {
        console.log('Ticket ID is required');
    } else if (!status) {
        console.log('Status is required');
    } else {
        const ticket = updateTicketCommand(ticketId.toUpperCase(), {
            status: status
        });

        if (!ticket) {
            console.log('Ticket not found');
        } else {
            console.log(`
✓ Ticket updated successfully

ID:          ${ticket.id}
Title:       ${ticket.title}
Description: ${ticket.description}
Status:      ${ticket.status}
Priority:    ${ticket.priority}
Tags:        ${ticket.tags.join(', ')}
`);
        }
    }
}