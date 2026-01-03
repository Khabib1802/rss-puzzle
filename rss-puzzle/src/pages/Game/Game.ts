import styles from './Game.module.scss';

import type { Page } from '../../types/interfaces';
import shuffleArray from '../../utils/shuffleArray.ts';
import WordPuzzle from '../../components/WordPuzzle/WordPuzzle.ts';

class Game implements Page {
  private wrapper: HTMLDivElement;

  private sourceBlock: HTMLDivElement;

  private resultBlock: HTMLDivElement;

  constructor() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add(styles.wrapper);

    this.resultBlock = document.createElement('div');
    this.resultBlock.classList.add(styles.result);

    this.sourceBlock = document.createElement('div');
    this.sourceBlock.classList.add(styles.source);

    this.render();
    this.renderWordPuzzles();
  }

  private renderWordPuzzles() {
    const sentence = 'This is a temporary example';
    const words = sentence.split(' ');

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
      });
    });
  }

  public render() {
    this.wrapper.append(this.resultBlock, this.sourceBlock);
  }

  getElement(): HTMLElement {
    return this.wrapper;
  }
}

export default Game;
