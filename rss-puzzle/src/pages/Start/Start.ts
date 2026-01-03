import styles from './Start.module.scss';

import Button from '../../components/Button/Button.ts';
import type { Page } from '../../types/interfaces.ts';

class Start implements Page {
  private wrapper: HTMLDivElement;

  private logoutButton: Button;

  private title: HTMLHeadingElement;

  private description: HTMLParagraphElement;

  private startButton: Button;

  public handleLogoutBtn: () => void;

  constructor(handleLogoutBtn: () => void) {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add(styles.wrapper);
    this.logoutButton = new Button('Logout', ['logout']);

    this.title = document.createElement('h1');
    this.title.classList.add(styles.title);
    this.title.textContent = 'RSS Puzzle';
    this.description = document.createElement('p');
    this.description.textContent =
      '“Start an engaging journey of learning English through interactive puzzles inspired by famous artworks”';
    this.description.classList.add(styles.description);

    this.startButton = new Button('Start', ['start']);

    this.handleLogoutBtn = handleLogoutBtn;

    this.setupEvents();
    this.render();
  }

  private setupEvents() {
    this.logoutButton.handleClick(() => {
      this.handleLogoutBtn();
    });
  }

  private render() {
    this.wrapper.append(this.logoutButton.getElement(), this.title, this.description, this.startButton.getElement());
  }

  getElement(): HTMLElement {
    return this.wrapper;
  }
}

export default Start;
