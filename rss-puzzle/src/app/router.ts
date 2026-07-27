import type { Page } from '@/types/pages';

export type Routes = Record<string, (() => Page) | undefined>;

class Router {
  private root: HTMLDivElement;

  private routes: Routes;

  private currentPage: Page | null = null;

  constructor(root: HTMLDivElement, routes: Routes) {
    this.root = root;
    this.routes = routes;
  }

  private handleRouting = () => {
    const hash = window.location.hash.slice(1) || '/';

    const getPage = this.routes[hash] || this.routes['/404'];
    if (getPage) {
      this.currentPage?.destroy?.();

      const page = getPage();
      this.currentPage = page;
      this.root.replaceChildren(page.element);
    }
  };

  public init() {
    window.addEventListener('hashchange', this.handleRouting);
    this.handleRouting();
  }
}

export default Router;
