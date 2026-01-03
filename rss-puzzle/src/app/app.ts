import '../styles/global.scss';
import Entry from '../pages/Entry/Entry.ts';
import Router from './router.ts';
import Start from '../pages/Start/Start.ts';
import localStorageService from '../services/localStorageService.ts';
import Game from '../pages/Game/Game.ts';

export default class App {
  private body: HTMLElement;

  private main: HTMLElement;

  private router: Router;

  constructor() {
    this.body = document.body;
    this.main = document.createElement('main');
    this.body.append(this.main);

    this.router = new Router(this.main);
  }

  private goToEntry() {
    this.router.go(new Entry(() => this.goToStart()));
  }

  private goToStart() {
    this.router.go(
      new Start(
        () => {
          localStorageService.removeUser();
          this.goToEntry();
        },
        () => {
          this.router.go(new Game());
        }
      )
    );
  }

  public start(): void {
    if (localStorageService.hasUser()) {
      this.goToStart();
    } else {
      this.goToEntry();
    }
  }
}
