import styles from './WordPuzzle.module.scss';

import BaseComponent from '../BaseComponent.ts';

class WordPuzzle extends BaseComponent<HTMLDivElement> {
  constructor(word: string) {
    super('div', [styles.word]);

    this.element.textContent = word;
  }

  public handleClick(callback: () => void): void {
    this.element.addEventListener('click', callback);
  }

  public setCorrect(): void {
    this.element.classList.add(styles.correct);
  }

  public setIncorrect(): void {
    this.element.classList.add(styles.incorrect);
  }

  public removeHighligh() {
    this.element.classList.remove(styles.correct, styles.incorrect);
  }
}

export default WordPuzzle;
