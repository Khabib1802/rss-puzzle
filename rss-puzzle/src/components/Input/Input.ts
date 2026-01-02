import styles from './Input.module.scss';

import BaseComponent from '../BaseComponent.ts';

interface InputOptions {
  label: string;
  placeholder?: string;
  required?: boolean;
}

class Input extends BaseComponent<HTMLDivElement> {
  private wrapper: HTMLElement;

  private input: HTMLInputElement;

  constructor(options: InputOptions) {
    super(() => document.createElement('div'), [styles.wrapper]);

    this.wrapper = this.element;

    const label = document.createElement('label');
    label.classList.add(styles.label);
    label.textContent = options.label;

    this.input = document.createElement('input');
    this.input.classList.add(styles.input);
    this.input.type = 'text';
    this.input.placeholder = options.placeholder || '';
    this.input.required = options.required || false;

    this.wrapper.append(label, this.input);
  }

  public handleInput(callback: () => void) {
    this.input.addEventListener('input', callback);
  }

  public isValid() {
    return this.input.required ? this.getValue().length > 0 : true;
  }

  public getValue() {
    return this.input.value;
  }
}

export default Input;
