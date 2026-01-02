import '../styles/global.scss';
import Entry from '../pages/Entry/Entry.ts';
import Router from './router.ts';
import Start from '../pages/Start/Start.ts';

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

  public start(): void {
    this.router.go(new Entry(() => this.router.go(new Start())));
  }
}
