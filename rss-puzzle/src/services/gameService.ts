import level1Data from '../data/levelData/wordCollectionLevel1.json';
import level2Data from '../data/levelData/wordCollectionLevel2.json';
import level3Data from '../data/levelData/wordCollectionLevel3.json';
import level4Data from '../data/levelData/wordCollectionLevel4.json';
import level5Data from '../data/levelData/wordCollectionLevel5.json';
import level6Data from '../data/levelData/wordCollectionLevel6.json';

import type { Level, Round } from '../types/interfaces';

class GameService {
  private levelDataMap: Record<number, Level> = {
    1: level1Data,
    2: level2Data,
    3: level3Data,
    4: level4Data,
    5: level5Data,
    6: level6Data,
  };

  public splitIntoWords(level: number, roundIndex: number, sentenceIndex: number): string[] {
    const round: Round = this.levelDataMap[level].rounds[roundIndex];
    return round.words[sentenceIndex].textExample.split(' ');
  }
}

export default GameService;
