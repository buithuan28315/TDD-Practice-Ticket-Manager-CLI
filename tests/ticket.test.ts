import { createTicket } from '../src/ticket';

describe('createTicket', () => {

  // title

  it('should reject ticket when title is missing', () => {
    const fakeTicket = {
      title: '',
      description: 'Users cannot login',
      status: 'open',
      priority: 'high',
      tags: ['bug', 'login'],
    };

    expect(() => {
      createTicket(fakeTicket);
    }).toThrow('Title is required');
  });

  it('should reject ticket when description is missing', () => {
    const fakeTicket = {
      title: 'Fix login bug',
      description: '',
      status: 'open',
      priority: 'high',
      tags: ['bug', 'login'],
    };

    expect(() => {
      createTicket(fakeTicket);
    }).toThrow('Description is required');
  });

  it.each([
    {
      status: 'pending',
      priority: 'high',
      tags: ['bug'],
      error: 'Status must be open or close',
    },
    {
      status: 'open',
      priority: 'urgent',
      tags: ['bug'],
      error: 'Priority must be low or medium or high',
    },
    {
      status: 'open',
      priority: 'high',
      tags: [''],
      error: 'Tags cannot contain empty values',
    },
  ])('should reject invalid ticket data', ({ status, priority, tags, error }) => {
    expect(() => {
      createTicket({
        title: 'Fix login bug',
        description: 'Users cannot login',
        status,
        priority,
        tags,
      });
    }).toThrow(error);
  });

});