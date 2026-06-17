import level1Data from '../data/levelData/wordCollectionLevel1.json';
import level2Data from '../data/levelData/wordCollectionLevel2.json';
import level3Data from '../data/levelData/wordCollectionLevel3.json';
import level4Data from '../data/levelData/wordCollectionLevel4.json';
import level5Data from '../data/levelData/wordCollectionLevel5.json';
import level6Data from '../data/levelData/wordCollectionLevel6.json';

import type { Level, Round } from '../types/game';

interface GameState {
  level: number;
  roundIndex: number;
  sentenceIndex: number;
  isChecked: boolean;
}

class GameService {
  private levelDataMap: Record<number, Level> = {
    1: level1Data,
    2: level2Data,
    3: level3Data,
    4: level4Data,
    5: level5Data,
    6: level6Data,
  };

  public gameState: GameState = {
    level: 1,
    roundIndex: 0,
    sentenceIndex: 0,
    isChecked: false,
  };

  public getCurrentSentence(): string {
    const { level, roundIndex, sentenceIndex } = this.gameState;
    const round: Round = this.levelDataMap[level].rounds[roundIndex];
    return round.words[sentenceIndex].textExample;
  }

  public nextStep() {
    const { level, roundIndex, sentenceIndex } = this.gameState;
    const maxSentence = this.levelDataMap[level].rounds[roundIndex].words.length;
    const maxRound = this.levelDataMap[level].roundsCount;
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
}

const gameService = new GameService();
export default gameService;
