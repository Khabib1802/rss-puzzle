import { createElement, type IconNode } from 'lucide';

import BaseComponent from '@/components/BaseComponent';

import styles from './Button.module.scss';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  text?: string;
  icon?: IconNode;
  iconPosition?: 'left' | 'right';
  variant?: ButtonVariant;
  size?: ButtonSize;
  active?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  onClick?: () => void;
  additionalClasses?: string[];
}

class Button extends BaseComponent<HTMLButtonElement> {
  private readonly textNode: HTMLSpanElement | null;

  private clickCallback: (() => void) | null = null;

  constructor(props: ButtonProps = {}) {
    super('button', Button.buildClasses(props));

    this.element.type = 'button';
    this.element.disabled = Boolean(props.disabled);

    if (props.active !== undefined) {
      this.element.classList.toggle(styles.active, props.active);
      this.element.setAttribute('aria-pressed', String(props.active));
    }

    if (props.ariaLabel) {
      this.element.setAttribute('aria-label', props.ariaLabel);
    }

    this.textNode = Button.appendContent(this.element, props);

    if (props.onClick) {
      this.handleClick(props.onClick);
    }
  }

  public setText(text: string): void {
    if (this.textNode) {
      this.textNode.textContent = text;
    }
  }

  public setActive(state: boolean): void {
    this.element.classList.toggle(styles.active, state);
    this.element.setAttribute('aria-pressed', String(state));
  }

  public setDisabled(state: boolean): void {
    this.element.disabled = state;
  }

  public handleClick(callback: () => void): void {
    if (this.clickCallback) {
      this.element.removeEventListener('click', this.clickCallback);
    }

    this.clickCallback = callback;
    this.element.addEventListener('click', callback);
  }

  private static buildClasses(props: ButtonProps): string[] {
    const variant = props.variant ?? 'secondary';
    const size = props.size ?? 'md';
    const isIconOnly = Boolean(props.icon) && !props.text;

    return [
      styles.button,
      styles[variant],
      styles[size],
      ...(isIconOnly ? [styles.iconOnly] : []),
      ...(props.additionalClasses ?? []),
    ];
  }

  private static appendContent(element: HTMLButtonElement, props: ButtonProps): HTMLSpanElement | null {
    const iconElement = props.icon ? createElement(props.icon) : null;
    iconElement?.classList.add(styles.icon);

    const textNode = props.text ? Button.createTextNode(props.text) : null;
    const nodes = props.iconPosition === 'right' ? [textNode, iconElement] : [iconElement, textNode];

    nodes.forEach((node) => {
      if (node) {
        element.append(node);
      }
    });

    return textNode;
  }

  private static createTextNode(text: string): HTMLSpanElement {
    const textNode = document.createElement('span');
    textNode.textContent = text;
    return textNode;
  }
}

export default Button;
