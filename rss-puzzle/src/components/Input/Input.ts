import styles from './Input.module.scss';

import BaseComponent from '../BaseComponent.ts';

interface InputOptions {
  label: string;
  placeholder?: string;
  minLength?: number;
  required?: boolean;
}

class Input extends BaseComponent<HTMLDivElement> {
  private wrapper: HTMLElement;

  private input: HTMLInputElement;

  private errorSpan: HTMLSpanElement;

  private errorMessage: string = '';

  constructor(options: InputOptions) {
    super('div', [styles['wrapper']]);

    this.wrapper = this.element;

    const label = document.createElement('label');
    label.classList.add(styles['label']);
    label.textContent = options.label;

    this.input = document.createElement('input');
    this.input.classList.add(styles['input']);
    this.input.type = 'text';
    this.input.placeholder = options.placeholder || '';
    this.input.minLength = options.minLength || 0;
    this.input.required = options.required || false;

    this.errorSpan = document.createElement('span');
    this.errorSpan.classList.add(styles['error']);
    this.errorSpan.textContent = this.errorMessage;

    this.wrapper.append(label, this.input, this.errorSpan);
  }

  public handleInput(callback: () => void) {
    this.input.addEventListener('input', callback);
  }

  public isValid() {
    this.errorMessage = this.validate(this.input.value);
    this.errorSpan.textContent = this.errorMessage;
    return !this.errorMessage;
  }

  private validate(value: string): string {
    if (this.input.value === '') {
      return 'Fill in this field';
    }

    const allowedSymbols = /^[A-Za-z-]+$/;
    if (!allowedSymbols.test(value)) {
      return 'Only English letters and "-" are allowed';
    }

    if (value[0] !== value[0].toUpperCase()) {
      return 'First letter should be uppercase';
    }

    if (this.input.minLength > value.length) {
      return `Minimul length is ${String(this.input.minLength)}`;
    }

    return '';
  }

  public getValue() {
    return this.input.value;
  }
}

export default Input;
