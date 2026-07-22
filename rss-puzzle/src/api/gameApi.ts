import DATA_BASE_URL from '../constants';
import type { Level } from '../types/game';

function fetchLevelData(levelNumber: number): Promise<Level> {
  const url = `${DATA_BASE_URL}levelData/wordCollectionLevel${String(levelNumber)}.json`;

  return fetch(url)
    .then((response: Response) => {
      if (!response.ok) {
        throw new Error(`data from ${String(levelNumber)} level is failed: ${response.statusText}`);
      }

      return response.json();
    })
    .then((data: unknown) => {
      return data as Level;
    });
}

export default fetchLevelData;
