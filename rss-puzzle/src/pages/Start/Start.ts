import styles from './Start.module.scss';

import Button from '../../components/Button/Button.ts';

import localStorageService from '../../services/localStorageService.ts';
import type { User } from '../../types/user.ts';
import BaseComponent from '../../components/BaseComponent.ts';

class StartPage extends BaseComponent<HTMLDivElement> {
  private title: BaseComponent<HTMLHeadingElement>;

  private greeting: BaseComponent<HTMLParagraphElement>;

  private description: BaseComponent<HTMLParagraphElement>;

  private buttonWrapper: BaseComponent<HTMLDivElement>;

  private logoutButton: Button;

  private startButton: Button;

  constructor() {
    super('div', ['wrapper']);

    this.title = new BaseComponent('h1', ['title']);
    this.title.element.textContent = 'RSS Puzzle';

    this.greeting = new BaseComponent('p', ['greeting']);
    this.greeting.element.textContent = '';

    this.description = new BaseComponent('p', ['description']);
    this.description.element.textContent =
      '“Start an engaging journey of learning English through interactive puzzles inspired by famous artworks”';

    this.buttonWrapper = new BaseComponent('div');
    this.logoutButton = new Button('Logout', [styles['logout']]);
    this.startButton = new Button('Start', ['start']);
    this.buttonWrapper.append(this.logoutButton.element, this.startButton.element);

    this.setupEvents();

    this.append(this.title, this.greeting, this.description, this.buttonWrapper);
  }

  private setupEvents() {
    this.logoutButton.handleClick(() => {
      localStorageService.removeUser();
      window.location.hash = '/entry';
    });

    this.startButton.handleClick(() => {
      window.location.hash = '/game';
    });

    const greetUser = (): void => {
      if (localStorageService.hasUser()) {
        const userRaw = localStorageService.getUser();
        if (userRaw !== null) {
          const user: User = JSON.parse(userRaw);
          this.greeting.element.textContent = `Hello, ${user.firstName} ${user.surname}!`;
        }
      }
    };
    greetUser();
  }
}

export default StartPage;
