import fs from 'fs';
import path from 'path';
import { KBClient, NewDocument } from './kb';

interface ParsedArguments {
    positional: string[];
    options: Map<string, string>;
}

function parseArguments(args: string[], allowedOptions: string[]): ParsedArguments {
    const positional: string[] = [];
    const options = new Map<string, string>();

    for (let index = 0; index < args.length; index += 1) {
        const argument = args[index];
        if (argument === undefined) {
            continue;
        }

        if (!argument.startsWith('--')) {
            positional.push(argument);
            continue;
        }

        const optionName = argument.slice(2);
        if (!allowedOptions.includes(optionName)) {
            throw new Error(`Unknown option: ${argument}`);
        }
        if (options.has(optionName)) {
            throw new Error(`Option --${optionName} can only be provided once`);
        }

        const value = args[index + 1];
        if (!value || value.startsWith('--')) {
            throw new Error(`Value is required for --${optionName}`);
        }

        options.set(optionName, value);
        index += 1;
    }

    return { positional, options };
}

function parseNonNegativeInteger(value: string, optionName: string): number {
    const parsed = Number(value);
    if (!Number.isSafeInteger(parsed) || parsed < 0) {
        throw new Error(`--${optionName} must be a non-negative integer`);
    }

    return parsed;
}

function parseTags(value?: string): string[] {
    return value
        ? value.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [];
}

function formatDocument(document: NewDocument & { id: string }): string {
    return [
        `ID:      ${document.id}`,
        `Title:   ${document.title}`,
        `Node:    ${document.nodePath}`,
        `Tags:    ${document.tags.length ? document.tags.join(', ') : '-'}`,
        `Content: ${document.content}`
    ].join('\n');
}

function requireNoPositionals(positional: string[], command: string): void {
    if (positional.length > 0) {
        throw new Error(`Unexpected argument for kb ${command}: ${positional[0]}`);
    }
}

export async function runKBCommand(args: string[], client: KBClient): Promise<void> {
    const [command, ...commandArgs] = args;

    if (command === 'search') {
        const { positional, options } = parseArguments(commandArgs, [
            'top-k', 'node', 'tags'
        ]);
        const query = positional[0]?.trim();
        if (!query) {
            throw new Error('Usage: kb search <query> [--top-k <number>] [--node <path>] [--tags <tag,...>]');
        }
        if (positional.length > 1) {
            throw new Error(`Unexpected search argument: ${positional[1]}`);
        }

        const topKValue = options.get('top-k');
        const nodePath = options.get('node');
        const tagsValue = options.get('tags');
        const results = await client.search({
            query,
            ...(topKValue !== undefined
                ? { topK: parseNonNegativeInteger(topKValue, 'top-k') }
                : {}),
            ...(nodePath !== undefined || tagsValue !== undefined
                ? {
                    filters: {
                        ...(nodePath !== undefined ? { nodePath } : {}),
                        ...(tagsValue !== undefined ? { tags: parseTags(tagsValue) } : {})
                    }
                }
                : {})
        });

        console.log('Search results:');
        if (results.length === 0) {
            console.log('No documents found.');
            return;
        }
        results.forEach(({ document }) => {
            console.log(`${document.id} | ${document.title} | ${document.nodePath}`);
        });
        return;
    }

    if (command === 'list') {
        const { positional, options } = parseArguments(commandArgs, ['node', 'limit']);
        requireNoPositionals(positional, 'list');
        const limitValue = options.get('limit');
        const documents = await client.list(
            options.get('node'),
            limitValue !== undefined ? parseNonNegativeInteger(limitValue, 'limit') : undefined
        );

        console.log('Documents:');
        if (documents.length === 0) {
            console.log('No documents found.');
            return;
        }
        documents.forEach((document) => {
            console.log(`${document.id} | ${document.title} | ${document.nodePath}`);
        });
        return;
    }

    if (command === 'retrieve') {
        const { positional } = parseArguments(commandArgs, []);
        const docId = positional[0];
        if (positional.length !== 1 || !docId) {
            throw new Error('Usage: kb retrieve <doc-id>');
        }

        const document = await client.retrieve(docId);
        if (!document) {
            throw new Error(`Document not found: ${docId}`);
        }
        console.log(formatDocument(document));
        return;
    }

    if (command === 'add') {
        const { positional, options } = parseArguments(commandArgs, [
            'file', 'path', 'tags', 'title'
        ]);
        requireNoPositionals(positional, 'add');
        const filePath = options.get('file');
        const nodePath = options.get('path');
        if (!filePath || !nodePath) {
            throw new Error('Usage: kb add --file <file> --path <node-path> [--title <title>] [--tags <tag,...>]');
        }
        if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
            throw new Error(`File not found: ${filePath}`);
        }

        const content = fs.readFileSync(filePath, 'utf8');
        if (!content.trim()) {
            throw new Error(`File is empty: ${filePath}`);
        }

        const document = await client.add({
            title: options.get('title') ?? path.basename(filePath, path.extname(filePath)),
            content,
            nodePath,
            tags: parseTags(options.get('tags'))
        });
        console.log('Document added successfully:');
        console.log(formatDocument(document));
        return;
    }

    throw new Error('Usage: kb <search|list|retrieve|add>');
}