import styles from './GamePage.module.scss';

import WordPuzzle from '../../components/WordPuzzle/WordPuzzle.ts';
import BaseComponent from '../../components/BaseComponent.ts';
import { checkUserWordOrder, isSentenceCorrect, shuffleArray, splitIntoWords } from '../../utils/sentenceUtils.ts';
import gameService from '../../services/gameService.ts';
import { findContainerAtPoint, getInsertionIndex, type Point } from '../../utils/dragAndDrop.ts';
import GameActions from '../../components/GameActions/GameActions.ts';
import HintPanel from '../../components/HintPanel/HintPanel.ts';

type ContainerId = 'source' | 'result';

class GamePage extends BaseComponent<HTMLDivElement> {
  private hintPanel: HintPanel;

  private mainBlock: BaseComponent<HTMLDivElement>;

  private sourceBlock: BaseComponent<HTMLDivElement>;

  private resultBlock: BaseComponent<HTMLDivElement>;

  private gameActions: GameActions;

  private sourcePuzzles: WordPuzzle[] = [];

  private resultPuzzles: WordPuzzle[] = [];

  private correctSentence = '';

  constructor() {
    super('div', ['wrapper']);

    this.mainBlock = new BaseComponent('div', [styles['mainBlock']]);
    this.resultBlock = new BaseComponent('div', [styles['result']]);
    this.sourceBlock = new BaseComponent('div', [styles['source']]);

    const initialHintState = gameService.settings.isTranslationHintEnabled;
    this.hintPanel = new HintPanel(initialHintState);

    this.mainBlock.append(this.resultBlock, this.sourceBlock);

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

    gameService.setChecked(false);

    this.gameActions.setVisibility({
      check: true,
      continue: false,
      autoComplete: true,
    });

    this.correctSentence = gameService.getCurrentSentence();

    const currentTranslation = gameService.getCurrentSentenceTranslation();
    this.renderHint(currentTranslation);

    const words = splitIntoWords(this.correctSentence);
    const shuffledWords = shuffleArray(words);

    this.renderSourcePuzzles(shuffledWords);
    this.renderBoardState();
  }

  private renderHint(currentTranslation: string): void {
    this.hintPanel.setTranslation(currentTranslation);
    this.renderHintVisibility();
  }

  private renderSourcePuzzles(words: string[]): void {
    this.sourcePuzzles = words.map((word) => this.createWordPuzzle(word));
    this.sourcePuzzles.forEach((puzzle) => {
      this.sourceBlock.append(puzzle.element);
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
      this.resultBlock.append(puzzle.element);
    } else {
      this.resultPuzzles = this.resultPuzzles.filter((p) => p !== puzzle);
      this.sourcePuzzles.push(puzzle);
      this.sourceBlock.append(puzzle.element);

      puzzle.setEdgeState(false, false);
    }

    this.renderBoardState();
  }

  private setupEvents() {
    this.hintPanel.toggleButton.handleClick(() => {
      const isEnabled = gameService.toggleTranslationHint();
      this.hintPanel.setToggleLabel(isEnabled);

      this.renderHintVisibility();
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
      this.toggleButtonsVisibility();
      gameService.setChecked(true);

      this.renderHintVisibility();
    }
  }

  private toggleButtonsVisibility() {
    this.gameActions.setVisibility({
      check: false,
      continue: true,
      autoComplete: false,
    });
  }

  private renderHintVisibility(): void {
    const isHintEnabled = gameService.settings.isTranslationHintEnabled;
    const isSentenceChecked = gameService.gameState.isChecked;

    const shouldBeVisible = isHintEnabled || isSentenceChecked;

    this.hintPanel.setVisible(shouldBeVisible);
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
      this.resultBlock.append(puzzle.element);
      puzzle.setCorrect();
    });

    gameService.setChecked(true);
    this.renderBoardState();

    this.hintPanel.setVisible(true);
    this.toggleButtonsVisibility();
  }

  private handleNextStep() {
    this.toggleButtonsVisibility();

    const hasNextStep = gameService.nextStep();

    if (hasNextStep) {
      this.startNewRound();
    } else {
      window.location.hash = '/';
    }
  }

  private clearContainers() {
    this.resultBlock.element.replaceChildren();
    this.sourceBlock.element.replaceChildren();
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
    return [
      { id: 'source', rect: this.sourceBlock.element.getBoundingClientRect() },
      { id: 'result', rect: this.resultBlock.element.getBoundingClientRect() },
    ];
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

    const targetBlock = targetId === 'source' ? this.sourceBlock : this.resultBlock;
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
    this.sourceBlock.element.classList.toggle(styles['dropTarget'], id === 'source');
    this.resultBlock.element.classList.toggle(styles['dropTarget'], id === 'result');
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
