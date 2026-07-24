import type { Page } from '@/types/pages';

export type Routes = Record<string, (() => Page) | undefined>;
class Router {
  private root: HTMLDivElement;

  private routes: Routes;

  constructor(root: HTMLDivElement, routes: Routes) {
    this.root = root;
    this.routes = routes;
  }

  private handleRouting = () => {
    const hash = window.location.hash.slice(1) || '/';

    const getPage = this.routes[hash] || this.routes['/404'];
    if (getPage) {
      const page = getPage();
      this.root.replaceChildren(page.element);
    }
  };

  public init() {
    window.addEventListener('hashchange', this.handleRouting);
    this.handleRouting();
  }
}

export default Router;
