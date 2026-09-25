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

  it('should reject ticket when title contains only spaces', () => {
    const fakeTicket = {
      title: '   ',
      description: 'Users cannot login',
      status: 'open',
      priority: 'high',
      tags: ['bug', 'login'],
    };

    expect(() => {
      createTicket(fakeTicket);
    }).toThrow('Title is required');
  });

  it('should reject ticket when title is undefined', () => {
    const fakeTicket = {
      title: undefined,
      description: 'Users cannot login',
      status: 'open',
      priority: 'high',
      tags: ['bug', 'login'],
    };

    expect(() => {
      createTicket(fakeTicket);
    }).toThrow('Title is required');
  });

  it('should pass ticket when title is filled', () => {
    const fakeTicket = {
      title: 'Fix Login Bug',
      description: 'Users cannot login',
      status: 'open',
      priority: 'high',
      tags: ['bug', 'login'],
    };

    expect(createTicket(fakeTicket)).toEqual(fakeTicket);
  });


  // description

  it('should reject ticket when description is missing', () => {
    const fakeTicket = {
      title: 'Fixing bug 1',
      description: '',
      status: 'open',
      priority: 'high',
      tags: ['bug', 'login'],
    };

    expect(() => {
      createTicket(fakeTicket);
    }).toThrow('Description is required');
  });

  it('should reject ticket when description contains only spaces', () => {
    const fakeTicket = {
      title: 'Fixing bug 1',
      description: '   ',
      status: 'open',
      priority: 'high',
      tags: ['bug', 'login'],
    };

    expect(() => {
      createTicket(fakeTicket);
    }).toThrow('Description is required');
  });

  it('should reject ticket when description is undefined', () => {
    const fakeTicket = {
      title: 'Fixing bug 1',
      description: undefined,
      status: 'open',
      priority: 'high',
      tags: ['bug', 'login'],
    };

    expect(() => {
      createTicket(fakeTicket);
    }).toThrow('Description is required');
  });

  it('should pass ticket when description is filled', () => {
    const fakeTicket = {
      title: 'Fixing bug 1',
      description: 'Cant login',
      status: 'open',
      priority: 'high',
      tags: ['bug', 'login'],
    };

    expect(createTicket(fakeTicket)).toEqual(fakeTicket);
  });


  // status, priority, tags

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
  ])(
    'should reject invalid ticket data',
    ({ status, priority, tags, error }) => {
      expect(() => {
        createTicket({
          title: 'Fix login bug',
          description: 'Users cannot login',
          status,
          priority,
          tags,
        });
      }).toThrow(error);
    }
  );

});