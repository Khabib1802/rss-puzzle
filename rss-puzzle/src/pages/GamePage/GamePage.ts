import styles from './GamePage.module.scss';

import WordPuzzle from '../../components/WordPuzzle/WordPuzzle.ts';
import BaseComponent from '../../components/BaseComponent.ts';
import { checkUserWordOrder, isSentenceCorrect, shuffleArray, splitIntoWords } from '../../utils/sentenceUtils.ts';
import gameService from '../../services/gameService.ts';
import { findContainerAtPoint, getInsertionIndex, type Point } from '../../utils/dragAndDrop.ts';
import GameActions from '../../components/GameActions/GameActions.ts';
import HintPanel from '../../components/HintPanel/HintPanel.ts';
import SentenceBoard from '../../components/SentenceBoard/SentenceBoard.ts';
import { HINT_KINDS } from '../../constants.ts';
import type { HintKind } from '../../types/game.ts';

type ContainerId = 'source' | 'result';

const CARD_HEIGHT = 44;

const ALL_HINT_KINDS = Object.values(HINT_KINDS);

// const CONTENT_HINT_KINDS = [HINT_KINDS.TRANSLATION, HINT_KINDS.PRONUNCIATION] as const;

class GamePage extends BaseComponent<HTMLDivElement> {
  private hintPanel: HintPanel;

  private mainBlock: BaseComponent<HTMLDivElement>;

  private sentenceBoard: SentenceBoard;

  private gameActions: GameActions;

  private sourcePuzzles: WordPuzzle[] = [];

  private resultPuzzles: WordPuzzle[] = [];

  private correctSentence = '';

  constructor() {
    super('div', ['wrapper']);

    this.mainBlock = new BaseComponent('div', [styles['mainBlock']]);
    this.sentenceBoard = new SentenceBoard();

    this.hintPanel = new HintPanel({
      translation: gameService.settings.translation,
      pronunciation: gameService.settings.pronunciation,
      image: gameService.settings.image,
    });

    this.mainBlock.append(this.sentenceBoard.element);
    this.gameActions = new GameActions();

    this.setupEvents();
    this.append(this.hintPanel, this.mainBlock, this.gameActions);

    this.init().catch((error: unknown) => {
      throw new Error(`Critical error during game initialization. Reason: ${String(error)}`);
    });
  }

  private async init() {
    await gameService.loadCurrentLevel();
    this.startNewRound();
  }

  private startNewRound(): void {
    this.clearContainers();

    this.hintPanel.stopAudio();
    gameService.setChecked(false);
    this.correctSentence = gameService.getCurrentSentence();

    const currentTranslation = gameService.getCurrentSentenceTranslation();
    this.renderHint(currentTranslation);
    this.hintPanel.setAudioSource(gameService.getCurrentSentenceAudio());

    const words = splitIntoWords(this.correctSentence);
    this.renderSourcePuzzles(words);

    this.renderState();
  }

  private renderHint(currentTranslation: string): void {
    this.hintPanel.setTranslation(currentTranslation);
  }

  private renderState(): void {
    this.renderActionsState();
    ALL_HINT_KINDS.forEach((kind) => {
      this.renderHintKindVisibility(kind);
    });
    this.renderCheckButtonState();
    this.updateEndpointConnectors();
  }

  private renderActionsState(): void {
    const isSentenceChecked = gameService.gameState.isChecked;

    this.gameActions.setVisibility({
      check: !isSentenceChecked,
      continue: isSentenceChecked,
      autoComplete: !isSentenceChecked,
    });
  }

  private renderSourcePuzzles(words: string[]): void {
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

    GamePage.applyImageSegments(orderedPuzzles);
  }

  private static applyImageSegments(orderedPuzzles: WordPuzzle[]): void {
    const totalSentences = gameService.getSentenceCountInCurrentRound();
    const imageUrl = gameService.getCurrentImageSource();

    const widths = orderedPuzzles.map((puzzle) => puzzle.element.getBoundingClientRect().width);
    const totalRowWidth = widths.reduce((sum, width) => sum + width, 0);
    const backgroundSize = `${String(totalRowWidth)}px ${String(totalSentences * CARD_HEIGHT)}px`;
    const positionY = gameService.gameState.sentenceIndex * CARD_HEIGHT;

    let cumulativeX = 0;
    orderedPuzzles.forEach((puzzle, index) => {
      puzzle.setImageSegment(imageUrl, backgroundSize, cumulativeX, positionY);
      cumulativeX += widths[index];
    });
  }

  private renderBoardState(): void {
    this.renderCheckButtonState();
    this.updateEndpointConnectors();
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

    this.renderBoardState();
  }

  private setupEvents() {
    ALL_HINT_KINDS.forEach((kind) => {
      this.hintPanel.getToggleButton(kind).handleClick(() => {
        const isEnabled = gameService.toggleHint(kind);
        this.hintPanel.setToggleLabel(kind, isEnabled);

        this.renderHintKindVisibility(kind);
      });
    });

    this.gameActions.continueButton.handleClick(() => {
      this.handleNextStep();
    });

    this.gameActions.checkButton.handleClick(() => {
      this.checkResultSentence();
      this.highlightWords();
    });

    this.gameActions.autoCompleteButton.handleClick(() => {
      this.handleAutoComplete();
    });
  }

  private highlightWords() {
    const userWords = this.resultPuzzles.map((puzzle) => puzzle.getWord());
    const correctWords = this.correctSentence.split(' ');

    const wordHighlightMask = checkUserWordOrder(userWords, correctWords);

    wordHighlightMask.forEach((isCorrectWord, index) => {
      const puzzle = this.resultPuzzles[index];

      if (isCorrectWord) {
        puzzle.setCorrect();
      } else {
        puzzle.setIncorrect();
      }
    });
  }

  private removeHighlight() {
    this.resultPuzzles.forEach((wordPuzzle) => {
      wordPuzzle.removeHighligh();
    });
  }

  private checkResultSentence(): void {
    const resultSentence = this.resultPuzzles.map((puzzle) => puzzle.getWord()).join(' ');

    if (isSentenceCorrect(resultSentence, this.correctSentence)) {
      gameService.setChecked(true);
      this.renderState();
    }
  }

  private renderHintKindVisibility(kind: HintKind): void {
    if (kind === 'image') {
      this.renderImageHintVisibility();
      return;
    }

    this.hintPanel.setHintVisible(kind, gameService.shouldRevealHint(kind));
  }

  private renderImageHintVisibility(): void {
    const shouldBeVisible = gameService.shouldRevealHint('image');

    [...this.sourcePuzzles, ...this.resultPuzzles].forEach((puzzle) => {
      puzzle.setImageVisible(shouldBeVisible);
    });
  }

  private renderCheckButtonState() {
    const isSourceEmpty = this.sourcePuzzles.length === 0;

    this.gameActions.setCheckDisabled(!isSourceEmpty);
  }

  private handleAutoComplete(): void {
    if (gameService.gameState.isChecked) return;

    const correctWords = splitIntoWords(this.correctSentence);

    this.clearContainers();

    this.resultPuzzles = correctWords.map((word) => this.createWordPuzzle(word));
    this.resultPuzzles.forEach((puzzle) => {
      this.sentenceBoard.resultBlock.append(puzzle.element);
      puzzle.setCorrect();
    });

    GamePage.applyImageSegments(this.resultPuzzles);

    gameService.setChecked(true);
    this.renderState();
  }

  private handleNextStep() {
    const hasNextStep = gameService.nextStep();

    if (hasNextStep) {
      this.startNewRound();
    } else {
      window.location.hash = '/';
    }
  }

  private clearContainers() {
    this.sentenceBoard.clear();
    this.resultPuzzles = [];
    this.sourcePuzzles = [];
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

  private getContainers(): { id: ContainerId; rect: DOMRect }[] {
    return this.sentenceBoard.getContainers();
  }

  private handleDragMove(point: Point): void {
    const hoveredId = findContainerAtPoint(point, this.getContainers());
    this.setDropTargetHighlight(hoveredId);
  }

  private handleDragEnd(puzzle: WordPuzzle, point: Point): void {
    this.setDropTargetHighlight(null);

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

    this.renderBoardState();
  }

  private setDropTargetHighlight(id: ContainerId | null): void {
    this.sentenceBoard.setDropTarget(id);
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

export default GamePage;
