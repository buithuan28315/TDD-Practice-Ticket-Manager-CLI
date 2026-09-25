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

});