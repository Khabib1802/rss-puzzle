class BaseComponent<T extends HTMLElement = HTMLElement> {
  public readonly element: T;

  constructor(tagName: keyof HTMLElementTagNameMap, classNames: string[] = []) {
    this.element = document.createElement(tagName) as T;
    if (classNames.length > 0) {
      this.element.classList.add(...classNames);
    }
  }

  public append(...components: (BaseComponent | HTMLElement)[]): void {
    components.forEach((component) => {
      if (component instanceof BaseComponent) {
        this.element.append(component.element);
      } else {
        this.element.append(component);
      }
    });
  }
}

export default BaseComponent;
