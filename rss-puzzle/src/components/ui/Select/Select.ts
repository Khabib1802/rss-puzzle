import styles from './Select.module.scss';

import BaseComponent from '../../BaseComponent.ts';

export interface SelectOption {
  value: string;
  label: string;
}

class Select extends BaseComponent<HTMLSelectElement> {
  constructor(options: SelectOption[] = [], additionalClasses: string[] = []) {
    super('select', [styles['select'], ...additionalClasses]);

    this.setOptions(options);
  }

  public setOptions(options: SelectOption[]): void {
    const previousValue = this.element.value;

    this.element.replaceChildren(
      ...options.map(({ value, label }) => {
        const optionElement = document.createElement('option');
        optionElement.value = value;
        optionElement.textContent = label;
        return optionElement;
      })
    );

    if (options.some((option) => option.value === previousValue)) {
      this.element.value = previousValue;
    }
  }

  public setValue(value: string): void {
    this.element.value = value;
  }

  public getValue(): string {
    return this.element.value;
  }

  public setDisabled(state: boolean): void {
    this.element.disabled = state;
  }

  public onChange(callback: (value: string) => void): void {
    this.element.addEventListener('change', () => {
      callback(this.element.value);
    });
  }
}

export default Select;
