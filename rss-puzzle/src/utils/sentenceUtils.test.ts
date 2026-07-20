import { describe, it, expect } from 'vitest';
import { splitIntoWords, isSentenceCorrect, checkUserWordOrder } from './sentenceUtils.ts';

describe('splitIntoWords', () => {
  it('splits a sentence into words', () => {
    expect(splitIntoWords('The cat sat')).toEqual(['The', 'cat', 'sat']);
  });

  it('collapses multiple spaces and trims edges', () => {
    expect(splitIntoWords('  The   cat  sat  ')).toEqual(['The', 'cat', 'sat']);
  });
});

describe('isSentenceCorrect', () => {
  it('returns true for an exact match', () => {
    expect(isSentenceCorrect('The cat sat', 'The cat sat')).toBe(true);
  });

  it('ignores surrounding whitespace', () => {
    expect(isSentenceCorrect('  The cat sat  ', 'The cat sat')).toBe(true);
  });

  it('returns false when word order differs', () => {
    expect(isSentenceCorrect('cat The sat', 'The cat sat')).toBe(false);
  });
});

describe('checkUserWordOrder', () => {
  it('marks each position as correct or incorrect', () => {
    const result = checkUserWordOrder(['The', 'sat', 'cat'], ['The', 'cat', 'sat']);
    expect(result).toEqual([true, false, false]);
  });
});
