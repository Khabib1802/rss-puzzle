import styles from './Start.module.scss';

import Button from '../../components/Button/Button.ts';
import type { Page, User } from '../../types/interfaces.ts';
import localStorageService from '../../services/localStorageService.ts';

class Start implements Page {
  private wrapper: HTMLDivElement;

  private logoutButton: Button;

  private title: HTMLHeadingElement;

  private greeting: HTMLParagraphElement;

  private description: HTMLParagraphElement;

  private startButton: Button;

  public handleLogoutBtn: () => void;

  public handleStartBtn: () => void;

  constructor(handleLogoutBtn: () => void, handleStartBtn: () => void) {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add(styles.wrapper);
    this.logoutButton = new Button('Logout', ['logout']);

    this.title = document.createElement('h1');
    this.title.classList.add(styles.title);
    this.title.textContent = 'RSS Puzzle';

    this.greeting = document.createElement('p');
    this.greeting.classList.add(styles.greeting);
    this.greeting.textContent = '';

    this.description = document.createElement('p');
    this.description.textContent =
      '“Start an engaging journey of learning English through interactive puzzles inspired by famous artworks”';
    this.description.classList.add(styles.description);

    this.startButton = new Button('Start', ['start']);

    this.handleLogoutBtn = handleLogoutBtn;
    this.handleStartBtn = handleStartBtn;

    this.setupEvents();
    this.render();
  }

  private setupEvents() {
    this.logoutButton.handleClick(() => {
      this.handleLogoutBtn();
    });

    this.startButton.handleClick(() => {
      this.handleStartBtn();
    });

    const greetUser = (): void => {
      if (localStorageService.hasUser()) {
        const userRaw = localStorageService.getUser();
        if (userRaw !== null) {
          const user: User = JSON.parse(userRaw);
          this.greeting.textContent = `Hello, ${user.firstName} ${user.surname}!`;
        }
      }
    };
    greetUser();
  }

  private render() {
    this.wrapper.append(
      this.logoutButton.getElement(),
      this.title,
      this.greeting,
      this.description,
      this.startButton.getElement()
    );
  }

  getElement(): HTMLElement {
    return this.wrapper;
  }
}

export default Start;
