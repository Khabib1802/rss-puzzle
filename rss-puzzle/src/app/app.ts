import Router, { type Routes } from './router.ts';
import EntryPage from '../pages/EntryPage/EntryPage.ts';
import StartPage from '../pages/StartPage/StartPage.ts';
import GamePage from '../pages/GamePage/GamePage.ts';
import NotFoundPage from '../pages/notFoundPage/notFoundPage.ts';

export default class App {
  private root: HTMLDivElement;

  constructor() {
    this.root = document.createElement('div');
    this.root.classList.add('root');
    document.body.append(this.root);
  }

  public start() {
    const routes: Routes = {
      '/': () => new StartPage(),
      '/entry': () => new EntryPage(),
      '/game': () => new GamePage(),
      '/404': () => new NotFoundPage(),
    };

    const router = new Router(this.root, routes);
    router.init();
  }
}
