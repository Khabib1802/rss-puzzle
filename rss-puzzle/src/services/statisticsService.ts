import type { LastCompletedRound, LevelProgress } from '@/types/game.ts';
import { LEVELS_COUNT } from '@/constants';

import { getItem, setItem } from './localStorageService';

const PROGRESS_KEY = 'levelProgress';
const LAST_COMPLETED_KEY = 'lastCompletedRound';

type ProgressListener = () => void;

class StatisticsService {
  private progress: LevelProgress = getItem(PROGRESS_KEY) ?? {};

  private lastCompleted: LastCompletedRound | null = getItem(LAST_COMPLETED_KEY);

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

    this.lastCompleted = { level, roundIndex };
    setItem(LAST_COMPLETED_KEY, this.lastCompleted);

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

  public getResumePosition(): LastCompletedRound | null {
    if (!this.lastCompleted) return null;

    const { level, roundIndex } = this.lastCompleted;
    const roundsCount = this.progress[level]?.roundsCount ?? 0;

    if (roundIndex + 1 < roundsCount) {
      return { level, roundIndex: roundIndex + 1 };
    }

    if (level + 1 <= LEVELS_COUNT) {
      return { level: level + 1, roundIndex: 0 };
    }

    return { level: 1, roundIndex: 0 };
  }
}

const statisticsService = new StatisticsService();
export default statisticsService;
