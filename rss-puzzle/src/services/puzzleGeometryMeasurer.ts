import WordPuzzle from '@/components/game/WordPuzzle/WordPuzzle.ts';
import { calculateRoundGeometry } from '@/utils/puzzleGeometry.ts';
import type { RoundGeometry } from '@/utils/puzzleGeometry.ts';

const measureWordWidths = (sentences: string[][]): number[][] => {
  const measureContainer = document.createElement('div');
  measureContainer.style.position = 'absolute';
  measureContainer.style.visibility = 'hidden';
  measureContainer.style.pointerEvents = 'none';
  document.body.append(measureContainer);

  const widths = sentences.map((words) =>
    words.map((word) => {
      const puzzle = new WordPuzzle(word);
      measureContainer.append(puzzle.element);
      return puzzle.element.getBoundingClientRect().width;
    })
  );

  measureContainer.remove();
  return widths;
};

const computeRoundGeometry = (
  sentences: string[][],
  referenceWidth: number,
  maxAllowedWidth: number,
  imageAspectRatio: number
): RoundGeometry => {
  const sentenceWordWidths = measureWordWidths(sentences);

  return calculateRoundGeometry({
    sentenceWordWidths,
    referenceWidth,
    maxAllowedWidth,
    imageAspectRatio,
    sentenceCount: sentences.length,
  });
};

export default computeRoundGeometry;
