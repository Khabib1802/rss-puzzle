import fetchLevelData from '../api/gameApi';
import { DATA_BASE_URL, HINT_KINDS } from '../constants';

import type { GameState, HintKind, HintSettings, Level, Round } from '../types/game';
import { getItem, removeItem, setItem } from './localStorageService';

const HINT_SETTINGS_KEY = 'hintSettings';

function createDefaultHintSettings(): HintSettings {
  const entries = Object.values(HINT_KINDS).map((kind) => [kind, true]);
  return Object.fromEntries(entries) as HintSettings;
}

class GameService {
  public gameState: GameState = {
    level: 1,
    roundIndex: 0,
    sentenceIndex: 0,
    isChecked: false,
  };

  public settings: HintSettings = getItem(HINT_SETTINGS_KEY) ?? createDefaultHintSettings();

  currentLevelData: Level | null = null;

  public async loadCurrentLevel() {
    try {
      const data = await fetchLevelData(this.gameState.level);

      this.currentLevelData = data;
    } catch {
      throw new Error('Error loading level data');
    }
  }

  private getCurrentRound(): Round {
    if (!this.currentLevelData) {
      throw new Error('Level data is not loaded. Call loadCurrentLevel() first');
    }
    const { roundIndex } = this.gameState;
    return this.currentLevelData.rounds[roundIndex];
  }

  public getCurrentSentence(): string {
    const { sentenceIndex } = this.gameState;
    const round = this.getCurrentRound();
    return round.words[sentenceIndex].textExample;
  }

  public getCurrentSentenceTranslation(): string {
    const { sentenceIndex } = this.gameState;
    const round = this.getCurrentRound();
    return round.words[sentenceIndex].textExampleTranslate;
  }

  public getCurrentSentenceAudio(): string {
    const { sentenceIndex } = this.gameState;

    const round = this.getCurrentRound();
    return `${DATA_BASE_URL}${round.words[sentenceIndex].audioExample}`;
  }

  public getCurrentImageSource(): string {
    const round = this.getCurrentRound();
    return `${DATA_BASE_URL}images/${round.levelData.cutSrc}`;
  }

  public getSentenceCountInCurrentRound(): number {
    const round = this.getCurrentRound();
    return round.words.length;
  }

  public nextStep() {
    if (!this.currentLevelData) {
      throw new Error('Level data is not loaded. Call loadCurrentLevel() first');
    }
    const { level, roundIndex, sentenceIndex } = this.gameState;
    const maxSentence = this.currentLevelData.rounds[roundIndex].words.length;
    const maxRound = this.currentLevelData.roundsCount;
    const maxLevel = 6;

    this.gameState.isChecked = false;

    if (sentenceIndex + 1 < maxSentence) {
      this.gameState.sentenceIndex += 1;
      return true;
    }

    this.gameState.sentenceIndex = 0;
    if (roundIndex + 1 < maxRound) {
      this.gameState.roundIndex += 1;
      return true;
    }

    this.gameState.roundIndex = 0;
    if (level + 1 <= maxLevel) {
      this.gameState.level += 1;
      return true;
    }

    return false;
  }

  public setChecked(value: boolean) {
    this.gameState.isChecked = value;
  }

  public toggleHint(kind: HintKind): boolean {
    this.settings[kind] = !this.settings[kind];
    setItem(HINT_SETTINGS_KEY, this.settings);
    return this.settings[kind];
  }

  public shouldRevealHint(kind: HintKind): boolean {
    return this.settings[kind] || this.gameState.isChecked;
  }

  public resetHintSettings(): void {
    this.settings = createDefaultHintSettings();
    removeItem(HINT_SETTINGS_KEY);
  }
}

const gameService = new GameService();
export default gameService;
