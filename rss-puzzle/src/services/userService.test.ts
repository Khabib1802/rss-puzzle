import { describe, it, expect, beforeEach } from 'vitest';
import { saveUser, getUser, hasUser, removeUser } from './userService.ts';
import type { User } from '../types/user.ts';

describe('userService', () => {
  const testUser: User = { firstName: 'John', surname: 'Doe' };

  beforeEach(() => {
    localStorage.clear();
  });

  it('returns null when no user is stored', () => {
    expect(getUser()).toBeNull();
  });

  it('reports no user by default', () => {
    expect(hasUser()).toBe(false);
  });

  it('saves and retrieves a user', () => {
    saveUser(testUser);
    expect(getUser()).toEqual(testUser);
  });

  it('reports a user exists after saving', () => {
    saveUser(testUser);
    expect(hasUser()).toBe(true);
  });

  it('removes the user', () => {
    saveUser(testUser);
    removeUser();

    expect(getUser()).toBeNull();
    expect(hasUser()).toBe(false);
  });

  it('overwrites a previously saved user', () => {
    saveUser(testUser);
    saveUser({ firstName: 'Jane', surname: 'Smith' });

    expect(getUser()).toEqual({ firstName: 'Jane', surname: 'Smith' });
  });
});
