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

  private checkButton: Button;

  private wordPuzzles: WordPuzzle[] = [];

  private correctSentence = '';

  constructor() {
    super('div', ['wrapper']);

    this.mainBlock = new BaseComponent('div', [styles['mainBlock']]);
    this.resultBlock = new BaseComponent('div', [styles['result']]);
    this.sourceBlock = new BaseComponent('div', [styles['source']]);

    this.mainBlock.append(this.resultBlock, this.sourceBlock);

    this.checkButton = new Button('Check', [styles['checkBtn']]);
    this.continueButton = new Button('Continue', [styles['continueBtn'], styles['hidden']]);

    this.init().catch((error: unknown) => {
      throw new Error(`Critical error during game initialization. Reason: ${String(error)}`);
    });

    this.setupEvents();

    this.append(this.mainBlock, this.checkButton, this.continueButton);
  }

  private async init() {
    await gameService.loadCurrentLevel();
    this.renderWordPuzzles();
  }

  private renderWordPuzzles(): void {
    this.resultBlock.element.replaceChildren();
    this.sourceBlock.element.replaceChildren();
    this.wordPuzzles.length = 0;

    this.correctSentence = gameService.getCurrentSentence();
    const words = splitIntoWords(this.correctSentence);

    this.checkButton.setDisabled(true);

    const shuffledWords = shuffleArray(words);

    shuffledWords.forEach((word) => {
      const wordPuzzle = new WordPuzzle(word);
      this.wordPuzzles.push(wordPuzzle);
      this.sourceBlock.append(wordPuzzle.element);

      wordPuzzle.handleClick(() => {
        if (!gameService.gameState.isChecked) {
          if (this.sourceBlock.element.contains(wordPuzzle.element)) {
            this.resultBlock.append(wordPuzzle.element);
          } else {
            this.sourceBlock.append(wordPuzzle.element);
          }
        }

        if (this.sourceBlock.element.children.length === 0) {
          this.checkButton.setDisabled(false);
        } else {
          this.checkButton.setDisabled(true);
          this.removeHighlight();
        }
      });
    });
  }

  private setupEvents() {
    this.continueButton.handleClick(() => {
      this.handleNextStep();
    });
    this.checkButton.handleClick(() => {
      this.checkResultSentence();
      this.highlightWords();
    });
  }

  private highlightWords() {
    const [userWords, correctWords] = [this.getResultSentence().split(' '), this.correctSentence.split(' ')];

    const isCorrectOrder = checkUserWordOrder(userWords, correctWords);
    isCorrectOrder.forEach((isCorrectWord, index) => {
      const userOrderedPuzzles = Array.from(this.resultBlock.element.children).map((child) => {
        return this.wordPuzzles.find((wordPuzzle) => {
          return wordPuzzle.element === child;
        });
      });

      if (userOrderedPuzzles[index]) {
        if (isCorrectWord) {
          userOrderedPuzzles[index].setCorrect();
        } else {
          userOrderedPuzzles[index].setIncorrect();
        }
      }
    });
  }

  private removeHighlight() {
    this.wordPuzzles.forEach((wordPuzzle) => {
      wordPuzzle.removeHighligh();
    });
  }

  private checkResultSentence(): void {
    const resultSentence = this.getResultSentence();

    if (isSentenceCorrect(resultSentence, this.correctSentence)) {
      this.toggleHidden();
      gameService.setChecked(true);
    }
  }

  private toggleHidden() {
    this.checkButton.element.classList.toggle(styles['hidden']);
    this.continueButton.element.classList.toggle(styles['hidden']);
  }

  private handleNextStep() {
    this.toggleHidden();

    const hasNextStep = gameService.nextStep();

    if (hasNextStep) {
      this.renderWordPuzzles();
    } else {
      window.location.hash = '/';
    }
  }

  private getResultSentence(): string {
    return Array.from(this.resultBlock.element.children)
      .map((child) => {
        const puzzle = this.wordPuzzles.find((p) => p.element === child);
        return puzzle ? puzzle.getWord() : '';
      })
      .join(' ');
  }
}

export default GamePage;
