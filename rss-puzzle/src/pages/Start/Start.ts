import Button from '../../components/Button/Button.ts';
import type { Page } from '../../types/interfaces.ts';

class Start implements Page {
  private wrapper: HTMLDivElement;

  private logoutButton: Button;

  private startButton: Button;

  public handleLogoutBtn: () => void;

  constructor(handleLogoutBtn: () => void) {
    this.wrapper = document.createElement('div');
    this.logoutButton = new Button('Logout', ['logout']);
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
    this.wrapper.append(this.logoutButton.getElement(), this.startButton.getElement());
  }

  getElement(): HTMLElement {
    return this.wrapper;
  }
}

export default Start;
