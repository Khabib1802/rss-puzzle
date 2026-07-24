import EntryPage from '@/pages/EntryPage/EntryPage.ts';
import StartPage from '@/pages/StartPage/StartPage.ts';
import GamePage from '@/pages/GamePage/GamePage.ts';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage.ts';
import type { Page } from '@/types/pages.ts';
import { hasUser } from '@/services/userService.ts';
import Router, { type Routes } from './router.ts';

function protectedRoute(factory: () => Page): () => Page {
  return () => {
    if (!hasUser()) {
      window.location.hash = '/entry';
      return new EntryPage();
    }
    return factory();
  };
}
export default class App {
  private root: HTMLDivElement;

  constructor() {
    this.root = document.createElement('div');
    this.root.classList.add('root');
    document.body.append(this.root);
  }

  public start() {
    const routes: Routes = {
      '/': protectedRoute(() => new StartPage()),
      '/entry': () => new EntryPage(),
      '/game': protectedRoute(() => new GamePage()),
      '/404': () => new NotFoundPage(),
    };

    const router = new Router(this.root, routes);
    router.init();
  }
}
