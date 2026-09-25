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

});