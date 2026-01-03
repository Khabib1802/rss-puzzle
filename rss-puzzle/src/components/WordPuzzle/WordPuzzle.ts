import styles from './WordPuzzle.module.scss';

import BaseComponent from '../BaseComponent.ts';

class WordPuzzle extends BaseComponent<HTMLDivElement> {
  constructor(word: string) {
    super(() => document.createElement('div'), [styles.word]);

    this.element.textContent = word;
  }

  public handleClick(callback: () => void): void {
    this.element.addEventListener('click', callback);
  }
}

export default WordPuzzle;
