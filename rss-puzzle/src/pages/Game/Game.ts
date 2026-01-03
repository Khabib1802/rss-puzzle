import type { Page } from '../../types/interfaces';

class Game implements Page {
  private wrapper: HTMLDivElement;

  constructor() {
    this.wrapper = document.createElement('div');
    this.wrapper.textContent = 'Game Page';
  }

  getElement(): HTMLElement {
    return this.wrapper;
  }
}

export default Game;
