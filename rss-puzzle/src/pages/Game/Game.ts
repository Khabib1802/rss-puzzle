import styles from './Game.module.scss';

import shuffleArray from '../../utils/shuffleArray.ts';
import WordPuzzle from '../../components/WordPuzzle/WordPuzzle.ts';
import GameService from '../../services/gameService.ts';
import Button from '../../components/Button/Button.ts';
import BaseComponent from '../../components/BaseComponent.ts';

class GamePage extends BaseComponent<HTMLDivElement> {
  private mainBlock: BaseComponent<HTMLDivElement>;

  private sourceBlock: BaseComponent<HTMLDivElement>;

  private resultBlock: BaseComponent<HTMLDivElement>;

  private continueButton: Button;

  private checkButton: Button;

  private gameService = GameService;

  private wordPuzzles: WordPuzzle[] = [];

  private level = 1;

  private roundIndex = 0;

  private sentenceIndex = 0;

  private correctSentence = '';

  private isChecked = false;

  constructor() {
    super('div', ['wrapper']);

    this.mainBlock = new BaseComponent('div', [styles['mainBlock']]);
    this.resultBlock = new BaseComponent('div', [styles['result']]);
    this.sourceBlock = new BaseComponent('div', [styles['source']]);

    this.mainBlock.append(this.resultBlock, this.sourceBlock);

    this.checkButton = new Button('Check', [styles['checkBtn']]);
    this.continueButton = new Button('Continue', [styles['continueBtn'], styles['hidden']]);

    this.renderWordPuzzles();
    this.setupEvents();

    this.append(this.mainBlock, this.checkButton, this.continueButton);
  }

  private renderWordPuzzles(): void {
    this.resultBlock.element.replaceChildren();
    this.sourceBlock.element.replaceChildren();
    this.wordPuzzles.length = 0;

    this.correctSentence = this.gameService.getSentence(this.level, this.roundIndex, this.sentenceIndex);
    const words = this.gameService.splitIntoWords(this.correctSentence);

    this.checkButton.setDisabled(true);

    const shuffledWords = shuffleArray(words);

    shuffledWords.forEach((word) => {
      const wordPuzzle = new WordPuzzle(word);
      this.wordPuzzles.push(wordPuzzle);
      this.sourceBlock.append(wordPuzzle.element);

      wordPuzzle.handleClick(() => {
        if (!this.isChecked) {
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
      this.nextSentence();
      this.isChecked = false;
    });
    this.checkButton.handleClick(() => {
      this.checkResultSentence();
      this.highlightWords();
    });
  }

  private highlightWords() {
    const isCorrectWordArray = this.gameService.checkUserOrder(
      this.getResultSentence().split(' '),
      this.correctSentence.split(' ')
    );
    isCorrectWordArray.forEach((isCorrectWord, index) => {
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

    if (this.gameService.isSentenceCorrect(resultSentence, this.correctSentence)) {
      this.toggleHidden();
      this.isChecked = true;
    }
  }

  private toggleHidden() {
    this.checkButton.element.classList.toggle(styles['hidden']);
    this.continueButton.element.classList.toggle(styles['hidden']);
  }

  private nextSentence() {
    this.toggleHidden();
    this.sentenceIndex += 1;

    const rounds = this.gameService.getRoundsCount(this.level);
    const sentences = this.gameService.getSentencesCount(this.level, this.roundIndex);
    const levels = 6;

    if (this.sentenceIndex < sentences) {
      this.renderWordPuzzles();
      return;
    }

    this.sentenceIndex = 0;
    this.roundIndex += 1;

    if (this.roundIndex < rounds) {
      this.renderWordPuzzles();
      return;
    }

    this.roundIndex = 0;
    this.level += 1;

    if (this.level <= levels) {
      this.renderWordPuzzles();
    }
  }

  private getResultSentence(): string {
    return Array.from(this.resultBlock.element.children)
      .map((wordPuzzle) => wordPuzzle.textContent)
      .join(' ');
  }
}

export default GamePage;
