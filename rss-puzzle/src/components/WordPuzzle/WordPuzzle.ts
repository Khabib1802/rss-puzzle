import styles from './WordPuzzle.module.scss';

import BaseComponent from '../BaseComponent.ts';

class WordPuzzle extends BaseComponent<HTMLDivElement> {
  private readonly word: string;

  constructor(word: string) {
    super('div', [styles['word']]);

    this.word = word;
    this.element.textContent = word;

    this.element.style.setProperty('--word-length', String(word.length));
  }

  public getWord() {
    return this.word;
  }

  public handleClick(callback: () => void): void {
    this.element.addEventListener('click', callback);
  }

  public setCorrect(): void {
    this.element.classList.add(styles['correct']);
  }

  public setIncorrect(): void {
    this.element.classList.add(styles['incorrect']);
  }

  public removeHighligh() {
    this.element.classList.remove(styles['correct'], styles['incorrect']);
  }
}

export default WordPuzzle;
