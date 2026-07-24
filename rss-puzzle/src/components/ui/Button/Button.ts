import BaseComponent from '@/components/BaseComponent';

import styles from './Button.module.scss';

class Button extends BaseComponent<HTMLButtonElement> {
  private button: HTMLButtonElement;

  constructor(text: string, additionalClasses: string[] = []) {
    super('button', [styles['button'], ...additionalClasses]);

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
