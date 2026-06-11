import type { Page } from '../types/pages';

class Router {
  private root: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  public go(page: Page): void {
    this.root.replaceChildren(page.getElement());
  }
}

export default Router;
