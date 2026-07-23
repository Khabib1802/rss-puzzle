import { describe, it, expect, beforeEach } from 'vitest';
import gameService from './gameService.ts';
import type { Level } from '../types/game.ts';

function makeLevel(roundsCount: number, sentencesPerRound: number): Level {
  return {
    roundsCount,
    rounds: Array.from({ length: roundsCount }, () => ({
      levelData: { id: '1', name: '', imageSrc: '', cutSrc: '', author: '', year: '' },
      words: Array.from({ length: sentencesPerRound }, (_, i) => ({
        id: i,
        word: '',
        wordTranslate: '',
        textExample: `sentence ${String(i)}`,
        textExampleTranslate: '',
        audioExample: '',
      })),
    })),
  };
}

describe('gameService.nextStep', () => {
  beforeEach(() => {
    const DEFAULT_ROUNDS_COUNT = 2;
    const DEFAULT_SENTENCES_COUNT = 2;

    gameService.gameState = { level: 1, roundIndex: 0, sentenceIndex: 0, isChecked: false };
    gameService.currentLevelData = makeLevel(DEFAULT_ROUNDS_COUNT, DEFAULT_SENTENCES_COUNT);
  });

  it('advances to the next sentence within the same round', () => {
    const hasNext = gameService.nextStep();

    expect(hasNext).toBe(true);
    expect(gameService.gameState).toMatchObject({ roundIndex: 0, sentenceIndex: 1 });
  });

  it('advances to the next round when the last sentence is done', () => {
    gameService.gameState.sentenceIndex = 1;

    const hasNext = gameService.nextStep();

    expect(hasNext).toBe(true);
    expect(gameService.gameState).toMatchObject({ roundIndex: 1, sentenceIndex: 0 });
  });

  it('advances to the next level when the last round is done', () => {
    gameService.gameState.roundIndex = 1;
    gameService.gameState.sentenceIndex = 1;

    const hasNext = gameService.nextStep();

    expect(hasNext).toBe(true);
    expect(gameService.gameState).toMatchObject({ level: 2, roundIndex: 0, sentenceIndex: 0 });
  });

  it('returns false once the final level is completed', () => {
    gameService.gameState = { level: 6, roundIndex: 1, sentenceIndex: 1, isChecked: false };

    expect(gameService.nextStep()).toBe(false);
  });

  it('resets isChecked on every call', () => {
    gameService.gameState.isChecked = true;

    gameService.nextStep();

    expect(gameService.gameState.isChecked).toBe(false);
  });
});

describe('gameService.setLevel / setRound', () => {
  const INITIAL_LEVEL = 3;
  const INITIAL_ROUND = 2;
  const INITIAL_SENTENCE = 1;

  const RESET_INDEX = 0;

  beforeEach(() => {
    gameService.gameState = {
      level: INITIAL_LEVEL,
      roundIndex: INITIAL_ROUND,
      sentenceIndex: INITIAL_SENTENCE,
      isChecked: true,
    };
  });

  it('sets the level and resets round, sentence and checked state', () => {
    const NEW_LEVEL = 5;

    gameService.setLevel(NEW_LEVEL);

    expect(gameService.gameState).toEqual({
      level: NEW_LEVEL,
      roundIndex: RESET_INDEX,
      sentenceIndex: RESET_INDEX,
      isChecked: false,
    });
  });

  it('sets the round and resets sentence and checked state, keeping the level', () => {
    const NEW_ROUND = 4;

    gameService.setRound(NEW_ROUND);

    expect(gameService.gameState).toEqual({
      level: INITIAL_LEVEL,
      roundIndex: NEW_ROUND,
      sentenceIndex: RESET_INDEX,
      isChecked: false,
    });
  });
});
