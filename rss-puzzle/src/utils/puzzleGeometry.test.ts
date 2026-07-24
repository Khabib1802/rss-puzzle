import { describe, it, expect } from 'vitest';
import { computeRoundGeometry, MIN_READABLE_WORD_WIDTH } from './puzzleGeometry.ts';

type GeometryInput = Parameters<typeof computeRoundGeometry>[0];

const DEFAULT_WORD_WIDTH = 100;
const DEFAULT_NARROW_WORD_WIDTH = 80;
const DEFAULT_REFERENCE_WIDTH = 800;
const DEFAULT_ASPECT_RATIO = 0.5;
const DEFAULT_SENTENCE_COUNT = 2;

const createTestArgs = (overrides?: Partial<GeometryInput>): GeometryInput => ({
  sentenceWordWidths: [
    [DEFAULT_WORD_WIDTH, DEFAULT_WORD_WIDTH],
    [DEFAULT_NARROW_WORD_WIDTH, DEFAULT_NARROW_WORD_WIDTH, DEFAULT_NARROW_WORD_WIDTH],
  ],
  referenceWidth: DEFAULT_REFERENCE_WIDTH,
  imageAspectRatio: DEFAULT_ASPECT_RATIO,
  sentenceCount: DEFAULT_SENTENCE_COUNT,
  ...overrides,
});

describe('computeRoundGeometry', () => {
  it('uses the reference width as-is when every sentence fits comfortably', () => {
    const geometry = computeRoundGeometry(createTestArgs());

    expect(geometry.boardWidth).toBe(800);
    expect(geometry.rowHeight).toBe((800 * 0.5) / 2);
    expect(geometry.backgroundSize).toBe('800px 400px');
  });

  it('scales every sentence of the round to the same board width', () => {
    const geometry = computeRoundGeometry(createTestArgs());
    const rowTotals = geometry.cardWidthsBySentence.map((words) => words.reduce((sum, width) => sum + width, 0));

    rowTotals.forEach((total) => {
      expect(total).toBeCloseTo(geometry.boardWidth);
    });
  });

  it('widens the board when the reference width would shrink a word below the readable minimum', () => {
    const geometry = computeRoundGeometry(
      createTestArgs({
        sentenceWordWidths: [[600, 20]],
        referenceWidth: 400,
        sentenceCount: 1,
      })
    );

    expect(geometry.boardWidth).toBeGreaterThan(400);
    const scaledSmallestWord = Math.min(...geometry.cardWidthsBySentence[0]);
    expect(scaledSmallestWord).toBeCloseTo(MIN_READABLE_WORD_WIDTH);
  });

  it('keeps proportions between words within the same sentence', () => {
    const geometry = computeRoundGeometry(
      createTestArgs({
        sentenceWordWidths: [[100, 200]],
        referenceWidth: 900,
        sentenceCount: 1,
      })
    );

    const [firstWord, secondWord] = geometry.cardWidthsBySentence[0];
    expect(secondWord / firstWord).toBeCloseTo(2);
  });
});
