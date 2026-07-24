import type { HintSettings, LevelProgress } from '@/types/game.ts';
import type { User } from '@/types/user.ts';

interface StorageSchema {
  user: User;
  hintSettings: HintSettings;
  levelProgress: LevelProgress;
}

const getItem = <K extends keyof StorageSchema>(key: K): StorageSchema[K] | null => {
  const raw = localStorage.getItem(key);
  return raw ? (JSON.parse(raw) as StorageSchema[K]) : null;
};

const setItem = <K extends keyof StorageSchema>(key: K, value: StorageSchema[K]): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

const removeItem = (key: keyof StorageSchema): void => {
  localStorage.removeItem(key);
};

export { getItem, setItem, removeItem };
