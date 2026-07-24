import type { User } from '@/types/user.ts';
import { getItem, setItem, removeItem } from './localStorageService.ts';

const USER_KEY = 'user';

export function saveUser(user: User): void {
  setItem(USER_KEY, user);
}

export function getUser(): User | null {
  return getItem(USER_KEY);
}

export function removeUser(): void {
  removeItem(USER_KEY);
}

export function hasUser(): boolean {
  return getUser() !== null;
}
