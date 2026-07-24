const MIN_READABLE_WORD_WIDTH = 70;

interface RoundGeometryInput {
  sentenceWordWidths: number[][];
  referenceWidth: number;
  imageAspectRatio: number;
  sentenceCount: number;
}

interface RoundGeometry {
  boardWidth: number;
  rowHeight: number;
  backgroundSize: string;
  cardWidthsBySentence: number[][];
}

function getRequiredBoardWidth(words: number[], naturalRowWidth: number): number {
  const smallestWord = Math.min(...words);
  return (MIN_READABLE_WORD_WIDTH * naturalRowWidth) / smallestWord;
}

function computeRoundGeometry({
  sentenceWordWidths,
  referenceWidth,
  imageAspectRatio,
  sentenceCount,
}: RoundGeometryInput): RoundGeometry {
  const naturalRowWidths = sentenceWordWidths.map((words) => words.reduce((sum, width) => sum + width, 0));

  const requiredWidths = sentenceWordWidths.map((words, index) =>
    getRequiredBoardWidth(words, naturalRowWidths[index])
  );

  const boardWidth = Math.max(referenceWidth, ...requiredWidths);
  const rowHeight = (boardWidth * imageAspectRatio) / sentenceCount;
  const backgroundSize = `${String(boardWidth)}px ${String(boardWidth * imageAspectRatio)}px`;

  const cardWidthsBySentence = sentenceWordWidths.map((words, index) => {
    const scale = boardWidth / naturalRowWidths[index];
    return words.map((width) => width * scale);
  });

  return { boardWidth, rowHeight, backgroundSize, cardWidthsBySentence };
}

export { computeRoundGeometry, MIN_READABLE_WORD_WIDTH };
export type { RoundGeometry, RoundGeometryInput };
