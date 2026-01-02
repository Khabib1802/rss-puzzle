class BaseComponent<T extends HTMLElement> {
  protected element: T;

  constructor(elementFactory: () => T, className?: string[]) {
    this.element = elementFactory();
    if (className) {
      this.element.classList.add(...className);
    }
  }

  public getElement(): T {
    return this.element;
  }
}

export default BaseComponent;
