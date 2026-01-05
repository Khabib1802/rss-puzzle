import styles from './Game.module.scss';

import type { Page } from '../../types/interfaces';
import shuffleArray from '../../utils/shuffleArray.ts';
import WordPuzzle from '../../components/WordPuzzle/WordPuzzle.ts';
import GameService from '../../services/gameService.ts';
import Button from '../../components/Button/Button.ts';

class Game implements Page {
  private wrapper: HTMLDivElement;

  private mainBlock: HTMLDivElement;

  private sourceBlock: HTMLDivElement;

  private resultBlock: HTMLDivElement;

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
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('wrapper');

    this.mainBlock = document.createElement('div');
    this.mainBlock.classList.add(styles.mainBlock);

    this.resultBlock = document.createElement('div');
    this.resultBlock.classList.add(styles.result);

    this.sourceBlock = document.createElement('div');
    this.sourceBlock.classList.add(styles.source);

    this.mainBlock.append(this.resultBlock, this.sourceBlock);

    this.checkButton = new Button('Check', [styles.checkBtn]);
    this.continueButton = new Button('Continue', [styles.continueBtn, styles.hidden]);

    this.render();
    this.renderWordPuzzles();
    this.setupEvents();
  }

  private renderWordPuzzles(): void {
    this.resultBlock.replaceChildren();
    this.sourceBlock.replaceChildren();
    this.wordPuzzles.length = 0;

    this.correctSentence = this.gameService.getSentence(this.level, this.roundIndex, this.sentenceIndex);
    const words = this.gameService.splitIntoWords(this.correctSentence);

    this.checkButton.setDisabled(true);

    const shuffledWords = shuffleArray(words);

    shuffledWords.forEach((word) => {
      const wordPuzzle = new WordPuzzle(word);
      this.wordPuzzles.push(wordPuzzle);
      this.sourceBlock.append(wordPuzzle.getElement());

      wordPuzzle.handleClick(() => {
        if (!this.isChecked) {
          if (this.sourceBlock.contains(wordPuzzle.getElement())) {
            this.resultBlock.append(wordPuzzle.getElement());
          } else {
            this.sourceBlock.append(wordPuzzle.getElement());
          }
        }

        if (this.sourceBlock.children.length === 0) {
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
      const userOrderedPuzzles = Array.from(this.resultBlock.children).map((child) => {
        return this.wordPuzzles.find((wordPuzzle) => {
          return wordPuzzle.getElement() === child;
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
    this.wordPuzzles.forEach((wordPuzzle) => wordPuzzle.removeHighligh());
  }

  private checkResultSentence(): void {
    const resultSentence = this.getResultSentence();

    if (this.gameService.isSentenceCorrect(resultSentence, this.correctSentence)) {
      this.toggleHidden();
      this.isChecked = true;
    }
  }

  private toggleHidden() {
    this.checkButton.getElement().classList.toggle(styles.hidden);
    this.continueButton.getElement().classList.toggle(styles.hidden);
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
    return Array.from(this.resultBlock.children)
      .map((wordPuzzle) => wordPuzzle.textContent)
      .join(' ');
  }

  public render(): void {
    this.wrapper.append(this.mainBlock, this.checkButton.getElement(), this.continueButton.getElement());
  }

  getElement(): HTMLElement {
    return this.wrapper;
  }
}

export default Game;
