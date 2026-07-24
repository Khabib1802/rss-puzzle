import WordPuzzle from '@/components/game/WordPuzzle/WordPuzzle.ts';
import SentenceBoard from '@/components/game/SentenceBoard/SentenceBoard.ts';
import { findContainerAtPoint, getInsertionIndex, type Point } from '@/utils/dragAndDrop.ts';
import { shuffleArray } from '@/utils/sentenceUtils.ts';
import gameService from '@/services/gameService.ts';
import type { RoundGeometry } from '@/utils/puzzleGeometry.ts';

type ContainerId = 'source' | 'result';

class PuzzleBoardController {
  private readonly sentenceBoard: SentenceBoard;

  private readonly onBoardChange: () => void;

  private sourcePuzzles: WordPuzzle[] = [];

  private resultPuzzles: WordPuzzle[] = [];

  private roundGeometry: RoundGeometry | null = null;

  constructor(sentenceBoard: SentenceBoard, onBoardChange: () => void) {
    this.sentenceBoard = sentenceBoard;
    this.onBoardChange = onBoardChange;
  }

  public initSentence(words: string[], roundGeometry: RoundGeometry): void {
    this.roundGeometry = roundGeometry;

    const shuffledIndexes = shuffleArray(words.map((_, index) => index));

    const orderedPuzzles: WordPuzzle[] = [];
    this.sourcePuzzles = shuffledIndexes.map((correctIndex) => {
      const puzzle = this.createWordPuzzle(words[correctIndex]);
      orderedPuzzles[correctIndex] = puzzle;
      return puzzle;
    });

    orderedPuzzles[orderedPuzzles.length - 1].setSentenceEnd();

    this.sourcePuzzles.forEach((puzzle) => {
      this.sentenceBoard.sourceBlock.append(puzzle.element);
    });

    this.applyImageSegments(orderedPuzzles);
  }

  public autoComplete(correctWords: string[]): void {
    this.clear();

    this.resultPuzzles = correctWords.map((word) => this.createWordPuzzle(word));
    this.resultPuzzles.forEach((puzzle) => {
      this.sentenceBoard.resultBlock.append(puzzle.element);
      puzzle.setCorrect();
    });

    this.applyImageSegments(this.resultPuzzles);
    this.updateEndpointConnectors();
  }

  public clear(): void {
    this.sentenceBoard.clear();
    this.resultPuzzles = [];
    this.sourcePuzzles = [];
  }

  public freezeResultRow(): void {
    this.resultPuzzles.forEach((puzzle) => {
      puzzle.removeHighligh();
      puzzle.freeze();
    });
  }

  public getResultWords(): string[] {
    return this.resultPuzzles.map((puzzle) => puzzle.getWord());
  }

  public getResultSentence(): string {
    return this.getResultWords().join(' ');
  }

  public highlightErrors(mask: boolean[]): void {
    mask.forEach((isCorrectWord, index) => {
      const puzzle = this.resultPuzzles[index];

      if (isCorrectWord) {
        puzzle.setCorrect();
      } else {
        puzzle.setIncorrect();
      }
    });
  }

  public removeHighlight(): void {
    this.resultPuzzles.forEach((puzzle) => {
      puzzle.removeHighligh();
    });
  }

  public isSourceEmpty(): boolean {
    return this.sourcePuzzles.length === 0;
  }

  public setImageVisible(visible: boolean): void {
    [...this.sourcePuzzles, ...this.resultPuzzles].forEach((puzzle) => {
      puzzle.setImageVisible(visible);
    });
  }

  private applyImageSegments(orderedPuzzles: WordPuzzle[]): void {
    if (!this.roundGeometry) {
      throw new Error('Round geometry is not computed yet');
    }

    const { rowHeight, backgroundSize, cardWidthsBySentence } = this.roundGeometry;
    const { sentenceIndex } = gameService.gameState;

    const imageUrl = gameService.getCurrentImageSource();
    const cardWidths = cardWidthsBySentence[sentenceIndex];
    const positionY = sentenceIndex * rowHeight;

    let cumulativeX = 0;
    orderedPuzzles.forEach((puzzle, index) => {
      const width = cardWidths[index];
      puzzle.setDimensions(width, rowHeight);
      puzzle.setImageSegment(imageUrl, backgroundSize, cumulativeX, positionY, width, rowHeight);
      cumulativeX += width;
    });
  }

  private createWordPuzzle(word: string): WordPuzzle {
    const puzzle = new WordPuzzle(word);

    puzzle.handleClick(() => {
      if (gameService.gameState.isChecked) return;
      this.handlePuzzleClick(puzzle);
    });

    puzzle.setDragGuard(() => !gameService.gameState.isChecked);
    puzzle.onDragStart(() => {
      this.removeHighlight();
    });
    puzzle.onDragMove((point) => {
      this.handleDragMove(point);
    });
    puzzle.onDragEnd((point) => {
      this.handleDragEnd(puzzle, point);
    });

    return puzzle;
  }

  private handlePuzzleClick(puzzle: WordPuzzle) {
    this.removeHighlight();

    if (this.sourcePuzzles.includes(puzzle)) {
      this.sourcePuzzles = this.sourcePuzzles.filter((p) => p !== puzzle);
      this.resultPuzzles.push(puzzle);
      this.sentenceBoard.resultBlock.append(puzzle.element);
    } else {
      this.resultPuzzles = this.resultPuzzles.filter((p) => p !== puzzle);
      this.sourcePuzzles.push(puzzle);
      this.sentenceBoard.sourceBlock.append(puzzle.element);

      puzzle.setEdgeState(false, false);
    }

    this.updateEndpointConnectors();
    this.onBoardChange();
  }

  private getContainers(): { id: ContainerId; rect: DOMRect }[] {
    return this.sentenceBoard.getContainers();
  }

  private handleDragMove(point: Point): void {
    const hoveredId = findContainerAtPoint(point, this.getContainers());
    this.sentenceBoard.setDropTarget(hoveredId);
  }

  private handleDragEnd(puzzle: WordPuzzle, point: Point): void {
    this.sentenceBoard.setDropTarget(null);

    const targetId = findContainerAtPoint(point, this.getContainers());
    if (!targetId) return;

    this.movePuzzleToContainer(puzzle, targetId, point);
  }

  private movePuzzleToContainer(puzzle: WordPuzzle, targetId: ContainerId, point: Point): void {
    this.sourcePuzzles = this.sourcePuzzles.filter((p) => p !== puzzle);
    this.resultPuzzles = this.resultPuzzles.filter((p) => p !== puzzle);

    const targetBlock = targetId === 'source' ? this.sentenceBoard.sourceBlock : this.sentenceBoard.resultBlock;
    const targetList = targetId === 'source' ? this.sourcePuzzles : this.resultPuzzles;

    if (targetId === 'source') {
      puzzle.setEdgeState(false, false);
    }

    const siblingRects = targetList.map((p) => p.element.getBoundingClientRect());
    const index = getInsertionIndex(point, siblingRects);

    puzzle.element.remove();
    const referenceElement = targetBlock.element.children[index] ?? null;
    targetBlock.element.insertBefore(puzzle.element, referenceElement);

    targetList.splice(index, 0, puzzle);

    this.updateEndpointConnectors();
    this.onBoardChange();
  }

  private updateEndpointConnectors(): void {
    this.resultPuzzles.forEach((puzzle) => {
      puzzle.setEdgeState(false, false);
    });

    const total = this.resultPuzzles.length;
    if (total === 0) return;

    const first = this.resultPuzzles[0];
    const last = this.resultPuzzles[total - 1];
    const isSourceEmpty = this.sourcePuzzles.length === 0;

    first.setEdgeState(true, isSourceEmpty && total === 1);

    if (isSourceEmpty && total > 1) {
      last.setEdgeState(false, true);
    }
  }
}

export default PuzzleBoardController;
