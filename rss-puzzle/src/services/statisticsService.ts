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

  public markRoundCompleted(level: number, roundIndex: number): void {
    const rounds = [...this.progress[level]];
    rounds[roundIndex] = true;

    this.progress = { ...this.progress, [level]: rounds };
    setItem(PROGRESS_KEY, this.progress);
    this.notify();
  }

  public isRoundCompleted(level: number, roundIndex: number): boolean {
    return this.progress[level][roundIndex];
  }

  public isLevelCompleted(level: number, roundsCount: number): boolean {
    const rounds = this.progress[level];
    if (rounds.length < roundsCount) return false;

    return Array.from({ length: roundsCount }, (_, index) => rounds[index]).every(Boolean);
  }
}

const statisticsService = new StatisticsService();
export default statisticsService;
