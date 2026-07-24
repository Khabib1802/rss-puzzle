import type { LevelProgress } from '@/types/game.ts';

import { getItem, setItem } from './localStorageService';

const PROGRESS_KEY = 'levelProgress';

type ProgressListener = () => void;

class StatisticsService {
  private progress: LevelProgress = getItem(PROGRESS_KEY) ?? {};

  private listeners = new Set<ProgressListener>();

  public subscribe(listener: ProgressListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      listener();
    });
  }

  public markRoundCompleted(level: number, roundIndex: number, roundsCount: number): void {
    const existing = this.progress[level];
    const completedRounds = existing ? [...existing.completedRounds] : [];
    completedRounds[roundIndex] = true;

    this.progress = { ...this.progress, [level]: { completedRounds, roundsCount } };
    setItem(PROGRESS_KEY, this.progress);
    this.notify();
  }

  public isRoundCompleted(level: number, roundIndex: number): boolean {
    return this.progress[level]?.completedRounds[roundIndex] ?? false;
  }

  public isLevelCompleted(level: number): boolean {
    const entry = this.progress[level];
    if (!entry) return false;

    return Array.from({ length: entry.roundsCount }, (_, index) => entry.completedRounds[index]).every(Boolean);
  }
}

const statisticsService = new StatisticsService();
export default statisticsService;
