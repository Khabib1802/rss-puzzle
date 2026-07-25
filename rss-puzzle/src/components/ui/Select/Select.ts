import BaseComponent from '@/components/BaseComponent';

import styles from './Select.module.scss';

const TYPEAHEAD_RESET_DELAY_MS = 500;

export interface SelectOption {
  value: string;
  label: string;
  isCompleted?: boolean;
}

let selectInstanceCount = 0;

class Select extends BaseComponent<HTMLDivElement> {
  private readonly trigger: HTMLButtonElement;

  private readonly valueLabel: HTMLSpanElement;

  private readonly listbox: HTMLUListElement;

  private readonly listboxId: string;

  private options: SelectOption[] = [];

  private optionElements: HTMLLIElement[] = [];

  private selectedValue = '';

  private activeIndex = -1;

  private isOpen = false;

  private typeaheadQuery = '';

  private typeaheadTimeoutId: ReturnType<typeof setTimeout> | null = null;

  private changeCallback: ((value: string) => void) | null = null;

  constructor(options: SelectOption[] = [], additionalClasses: string[] = []) {
    super('div', [styles.select, ...additionalClasses]);

    selectInstanceCount += 1;
    this.listboxId = `select-listbox-${String(selectInstanceCount)}`;

    this.trigger = Select.createTrigger();
    this.valueLabel = document.createElement('span');
    this.valueLabel.classList.add(styles.value);
    this.trigger.append(this.valueLabel);

    this.listbox = this.createListbox();

    this.element.append(this.trigger, this.listbox);

    this.bindEvents();
    this.setOptions(options);
  }

  public setOptions(options: SelectOption[]): void {
    const previousValue = this.selectedValue;

    this.options = options;
    this.optionElements = options.map((option, index) => this.createOptionElement(option, index));
    this.listbox.replaceChildren(...this.optionElements);

    this.restoreSelection(previousValue);
  }

  public setValue(value: string): void {
    const index = this.options.findIndex((option) => option.value === value);
    if (index >= 0) {
      this.selectByIndex(index, false);
    }
  }

  public getValue(): string {
    return this.selectedValue;
  }

  public getOptionsCount(): number {
    return this.options.length;
  }

  public setDisabled(state: boolean): void {
    this.trigger.disabled = state;
    if (state) {
      this.close();
    }
  }

  public onChange(callback: (value: string) => void): void {
    this.changeCallback = callback;
  }

  private static createTrigger(): HTMLButtonElement {
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.classList.add(styles.trigger);
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    return trigger;
  }

  private createListbox(): HTMLUListElement {
    const listbox = document.createElement('ul');
    listbox.classList.add(styles.listbox);
    listbox.id = this.listboxId;
    listbox.setAttribute('role', 'listbox');
    listbox.hidden = true;
    this.trigger.setAttribute('aria-controls', this.listboxId);
    return listbox;
  }

  private createOptionElement(option: SelectOption, index: number): HTMLLIElement {
    const optionElement = document.createElement('li');
    optionElement.classList.add(styles.option);
    optionElement.classList.toggle(styles.completed, Boolean(option.isCompleted));
    optionElement.setAttribute('role', 'option');
    optionElement.id = `${this.listboxId}-option-${String(index)}`;
    optionElement.dataset['value'] = option.value;
    optionElement.textContent = option.label;

    optionElement.addEventListener('click', () => {
      this.selectByIndex(index);
      this.close();
      this.trigger.focus();
    });

    return optionElement;
  }

  private restoreSelection(previousValue: string): void {
    const matchIndex = this.options.findIndex((option) => option.value === previousValue);

    if (matchIndex >= 0) {
      this.selectByIndex(matchIndex, false);
      return;
    }

    if (this.options.length > 0) {
      this.selectByIndex(0, false);
      return;
    }

    this.selectedValue = '';
    this.activeIndex = -1;
    this.valueLabel.textContent = '';
  }

  private selectByIndex(index: number, notify = true): void {
    if (index < 0 || index >= this.options.length) {
      return;
    }

    const option = this.options[index];
    const optionElement = this.optionElements[index];

    this.activeIndex = index;
    this.selectedValue = option.value;
    this.valueLabel.textContent = option.label;

    this.optionElements.forEach((element, elementIndex) => {
      element.setAttribute('aria-selected', String(elementIndex === index));
      element.classList.toggle(styles.selected, elementIndex === index);
    });

    this.trigger.setAttribute('aria-activedescendant', optionElement.id);

    if (notify) {
      this.changeCallback?.(option.value);
    }
  }

  private open(): void {
    if (this.trigger.disabled || this.options.length === 0) {
      return;
    }

    this.isOpen = true;
    this.listbox.hidden = false;
    this.trigger.setAttribute('aria-expanded', 'true');
    this.element.classList.add(styles.open);
    this.highlight(this.activeIndex >= 0 ? this.activeIndex : 0);
  }

  private close(): void {
    this.isOpen = false;
    this.listbox.hidden = true;
    this.trigger.setAttribute('aria-expanded', 'false');
    this.element.classList.remove(styles.open);
  }

  private toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  private highlight(index: number): void {
    if (index < 0 || index >= this.optionElements.length) {
      return;
    }

    this.activeIndex = index;
    const activeOption = this.optionElements[index];

    this.optionElements.forEach((element, elementIndex) => {
      element.classList.toggle(styles.active, elementIndex === index);
    });

    this.trigger.setAttribute('aria-activedescendant', activeOption.id);
    activeOption.scrollIntoView({ block: 'nearest' });
  }

  private bindEvents(): void {
    this.trigger.addEventListener('click', () => {
      this.toggle();
    });

    this.trigger.addEventListener('keydown', (event) => {
      this.handleKeydown(event);
    });

    document.addEventListener('click', (event) => {
      if (event.target instanceof Node && !this.element.contains(event.target)) {
        this.close();
      }
    });
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (!this.isOpen) {
      this.handleClosedKeydown(event);
      return;
    }

    this.handleOpenKeydown(event);
  }

  private handleClosedKeydown(event: KeyboardEvent): void {
    const openKeys = ['ArrowDown', 'ArrowUp', 'Enter', ' '];
    if (openKeys.includes(event.key)) {
      event.preventDefault();
      this.open();
    }
  }

  private handleOpenKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.highlight(Math.min(this.activeIndex + 1, this.optionElements.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.highlight(Math.max(this.activeIndex - 1, 0));
        break;
      case 'Home':
        event.preventDefault();
        this.highlight(0);
        break;
      case 'End':
        event.preventDefault();
        this.highlight(this.optionElements.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectByIndex(this.activeIndex);
        this.close();
        break;
      case 'Escape':
        event.preventDefault();
        this.close();
        break;
      default:
        this.handleTypeahead(event.key);
    }
  }

  private handleTypeahead(key: string): void {
    if (key.length !== 1) {
      return;
    }

    this.typeaheadQuery += key.toLowerCase();

    if (this.typeaheadTimeoutId) {
      clearTimeout(this.typeaheadTimeoutId);
    }

    this.typeaheadTimeoutId = setTimeout(() => {
      this.typeaheadQuery = '';
    }, TYPEAHEAD_RESET_DELAY_MS);

    const matchIndex = this.options.findIndex((option) => option.label.toLowerCase().startsWith(this.typeaheadQuery));

    if (matchIndex >= 0) {
      this.highlight(matchIndex);
    }
  }
}

export default Select;
