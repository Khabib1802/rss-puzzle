import styles from './GamePage.module.scss';

import WordPuzzle from '../../components/WordPuzzle/WordPuzzle.ts';
import Button from '../../components/Button/Button.ts';
import BaseComponent from '../../components/BaseComponent.ts';
import { checkUserWordOrder, isSentenceCorrect, shuffleArray, splitIntoWords } from '../../utils/sentenceUtils.ts';
import gameService from '../../services/gameService.ts';

class GamePage extends BaseComponent<HTMLDivElement> {
  private mainBlock: BaseComponent<HTMLDivElement>;

  private sourceBlock: BaseComponent<HTMLDivElement>;

  private resultBlock: BaseComponent<HTMLDivElement>;

  private continueButton: Button;

  private autoCompleteButton: Button;

  private checkButton: Button;

  private sourcePuzzles: WordPuzzle[] = [];

  private resultPuzzles: WordPuzzle[] = [];

  private correctSentence = '';

  constructor() {
    super('div', ['wrapper']);

    this.mainBlock = new BaseComponent('div', [styles['mainBlock']]);
    this.resultBlock = new BaseComponent('div', [styles['result']]);
    this.sourceBlock = new BaseComponent('div', [styles['source']]);

    this.mainBlock.append(this.resultBlock, this.sourceBlock);

    this.checkButton = new Button('Check', [styles['checkButton']]);
    this.autoCompleteButton = new Button('Auto-Complete', [styles['autoCompleteButton']]);
    this.continueButton = new Button('Continue', [styles['continueButton'], styles['hidden']]);

    this.setupEvents();
    this.append(this.mainBlock, this.checkButton, this.autoCompleteButton, this.continueButton);

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

    this.correctSentence = gameService.getCurrentSentence();
    const words = splitIntoWords(this.correctSentence);
    const shuffledWords = shuffleArray(words);

    this.sourcePuzzles = shuffledWords.map((word) => this.createWordPuzzle(word));
    this.sourcePuzzles.forEach((puzzle) => {
      this.sourceBlock.append(puzzle.element);
    });

    this.updateCheckButtonState();
  }

  private createWordPuzzle(word: string): WordPuzzle {
    const puzzle = new WordPuzzle(word);

    puzzle.handleClick(() => {
      if (gameService.gameState.isChecked) return;
      this.handlePuzzleClick(puzzle);
    });

    return puzzle;
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
    }

    this.updateCheckButtonState();
  }

  private setupEvents() {
    this.continueButton.handleClick(() => {
      this.handleNextStep();
    });

    this.checkButton.handleClick(() => {
      this.checkResultSentence();
      this.highlightWords();
    });

    this.autoCompleteButton.handleClick(() => {
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
    }
  }

  private toggleButtonsVisibility() {
    [this.checkButton, this.continueButton, this.autoCompleteButton].forEach((button) => {
      button.element.classList.toggle(styles['hidden']);
    });
  }

  private updateCheckButtonState() {
    const isSourceEmpty = this.sourcePuzzles.length === 0;

    this.checkButton.setDisabled(!isSourceEmpty);
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
}

export default GamePage;
