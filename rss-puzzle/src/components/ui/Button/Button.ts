import BaseComponent from '@/components/BaseComponent';

class Button extends BaseComponent<HTMLButtonElement> {
  private button: HTMLButtonElement;

  constructor(text: string, additionalClasses: string[] = []) {
    super('button', [...additionalClasses]);

    this.button = this.element;

    this.button.textContent = text;
  }

  public setText(text: string | null): void {
    this.element.textContent = text;
  }

  public setDisabled(state: boolean): void {
    this.element.disabled = state;
  }

  public handleClick(callback: () => void): void {
    this.element.addEventListener('click', callback);
  }
}

export default Button;
