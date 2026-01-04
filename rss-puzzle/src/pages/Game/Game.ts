import styles from './Game.module.scss';

import type { Page } from '../../types/interfaces';
import shuffleArray from '../../utils/shuffleArray.ts';
import WordPuzzle from '../../components/WordPuzzle/WordPuzzle.ts';
import GameService from '../../services/gameService.ts';
import Button from '../../components/Button/Button.ts';

class Game implements Page {
  private wrapper: HTMLDivElement;

  private sourceBlock: HTMLDivElement;

  private resultBlock: HTMLDivElement;

  private continueButton: Button;

  private gameService = GameService;

  private level = 1;

  private roundIndex = 0;

  private sentenceIndex = 0;

  private correctSentence = '';

  constructor() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add(styles.wrapper);

    this.resultBlock = document.createElement('div');
    this.resultBlock.classList.add(styles.result);

    this.sourceBlock = document.createElement('div');
    this.sourceBlock.classList.add(styles.source);

    this.continueButton = new Button('Continue');

    this.render();
    this.renderWordPuzzles();
    this.setupEvents();
  }

  private renderWordPuzzles(): void {
    this.resultBlock.replaceChildren();
    this.sourceBlock.replaceChildren();

    this.correctSentence = this.gameService.getSentence(this.level, this.roundIndex, this.sentenceIndex);
    const words = this.gameService.splitIntoWords(this.correctSentence);

    this.continueButton.setDisabled(true);

    const shuffledWords = shuffleArray(words);

    shuffledWords.forEach((word) => {
      const wordPuzzle = new WordPuzzle(word);
      this.sourceBlock.append(wordPuzzle.getElement());

      wordPuzzle.handleClick(() => {
        if (this.sourceBlock.contains(wordPuzzle.getElement())) {
          this.resultBlock.append(wordPuzzle.getElement());
        } else {
          this.sourceBlock.append(wordPuzzle.getElement());
        }
        this.checkResultSentence();
      });
    });
  }

  private setupEvents() {
    this.continueButton.handleClick(() => this.nextSentence());
  }

  private checkResultSentence(): void {
    const resultSentence = this.getResultSentence();

    if (this.gameService.isSentenceCorrect(resultSentence, this.correctSentence)) {
      this.continueButton.setDisabled(false);
    }
  }

  private nextSentence() {
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
    this.wrapper.append(this.resultBlock, this.sourceBlock, this.continueButton.getElement());
  }

  getElement(): HTMLElement {
    return this.wrapper;
  }
}

export default Game;
