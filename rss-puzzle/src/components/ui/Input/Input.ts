import {
  type Validator,
  runValidators,
  required,
  allowedSymbols,
  firstUppercase,
  minLength,
} from '@/utils/validation.ts';
import BaseComponent from '@/components/BaseComponent';

import styles from './Input.module.scss';

interface InputOptions {
  label: string;
  placeholder?: string;
  minLength?: number;
  required?: boolean;
  validators?: Validator[];
}

class Input extends BaseComponent<HTMLDivElement> {
  private static idCounter = 0;

  private wrapper: HTMLElement;

  private input: HTMLInputElement;

  private errorSpan: HTMLSpanElement;

  private errorMessage: string = '';

  private validators: Validator[] = [];

  constructor(options: InputOptions) {
    super('div', [styles.wrapper]);

    this.wrapper = this.element;

    const inputId = `input-${String((Input.idCounter += 1))}`;
    const errorId = `${inputId}-error`;

    const label = document.createElement('label');
    label.classList.add(styles.label);
    label.textContent = options.label;
    label.htmlFor = inputId;

    this.input = document.createElement('input');
    this.input.id = inputId;
    this.input.classList.add(styles.input);
    this.input.type = 'text';
    this.input.placeholder = options.placeholder || ' ';
    this.input.minLength = options.minLength || 0;
    this.input.required = options.required || false;
    this.input.setAttribute('aria-describedby', errorId);

    this.errorSpan = document.createElement('span');
    this.errorSpan.id = errorId;
    this.errorSpan.classList.add(styles.error);
    this.errorSpan.textContent = this.errorMessage;

    this.wrapper.append(this.input, label, this.errorSpan);

    if (options.validators && options.validators.length) {
      this.validators = options.validators;
    } else {
      const list: Validator[] = [];
      if (options.required) list.push(required());
      list.push(allowedSymbols());
      list.push(firstUppercase());
      if (options.minLength && options.minLength > 0) list.push(minLength(options.minLength));
      this.validators = list;
    }

    this.input.addEventListener('input', () => {
      this.isValid();
    });
  }

  public handleInput(callback: () => void) {
    this.input.addEventListener('input', callback);
  }

  public isValid() {
    this.errorMessage = runValidators(this.input.value, this.validators);
    this.errorSpan.textContent = this.errorMessage;
    this.errorSpan.classList.toggle(styles.errorVisible, Boolean(this.errorMessage));
    this.input.setAttribute('aria-invalid', String(Boolean(this.errorMessage)));

    if (this.errorMessage) {
      this.input.classList.add(styles.invalid);
      this.input.classList.remove(styles.valid);
    } else {
      this.input.classList.remove(styles.invalid);
      this.input.classList.add(styles.valid);
    }

    return !this.errorMessage;
  }

  public getValue() {
    return this.input.value;
  }
}

export default Input;
