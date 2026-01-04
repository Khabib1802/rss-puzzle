interface WordData {
  audioExample: string;
  textExample: string;
  textExampleTranslate: string;
  id: number;
  word: string;
  wordTranslate: string;
}

interface LevelData {
  id: string;
  name: string;
  imageSrc: string;
  cutSrc: string;
  author: string;
  year: string;
}

interface Round {
  levelData: LevelData;
  words: WordData[];
}

interface Level {
  rounds: Round[];
  roundsCount: number;
}

interface Page {
  getElement(): HTMLElement;
}

interface User {
  firstName: string;
  surname: string;
}

export type { Page, User, Level, Round };
