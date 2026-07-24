import type { HINT_KINDS } from '@/constants';

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

interface GameState {
  level: number;
  roundIndex: number;
  sentenceIndex: number;
  isChecked: boolean;
}

type HintKind = (typeof HINT_KINDS)[keyof typeof HINT_KINDS];

type HintSettings = Record<HintKind, boolean>;

type ContentHintKind = Exclude<HintKind, typeof HINT_KINDS.IMAGE>;

export type { Level, Round, GameState, HintKind, HintSettings, ContentHintKind };
