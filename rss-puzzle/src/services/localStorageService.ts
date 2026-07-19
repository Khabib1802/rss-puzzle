import type { User } from '../types/user.ts';

interface StorageSchema {
  user: User;
}

export function getItem<K extends keyof StorageSchema>(key: K): StorageSchema[K] | null {
  const raw = localStorage.getItem(key);
  return raw ? (JSON.parse(raw) as StorageSchema[K]) : null;
}

export function setItem<K extends keyof StorageSchema>(key: K, value: StorageSchema[K]): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeItem(key: keyof StorageSchema): void {
  localStorage.removeItem(key);
}
