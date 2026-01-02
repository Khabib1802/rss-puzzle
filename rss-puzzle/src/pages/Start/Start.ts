import type { Page } from '../../types/interfaces.ts';

class Start implements Page {
  private wrapper: HTMLDivElement;

  constructor() {
    this.wrapper = document.createElement('div');
  }

  getElement(): HTMLElement {
    return this.wrapper;
  }
}

export default Start;
