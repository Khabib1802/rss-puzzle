import styles from './TranslationHint.module.scss';

import BaseComponent from '../BaseComponent.ts';

class TranslationHint extends BaseComponent<HTMLDivElement> {
  private readonly toggleButton: HTMLButtonElement;

  private readonly translationText: HTMLDivElement;

  private isVisible = false;

  constructor(translation: string) {
    super('div', [styles['hint']]);

    this.toggleButton = document.createElement('button');
    this.toggleButton.type = 'button';
    this.toggleButton.classList.add(styles['toggle']);
    this.toggleButton.setAttribute('aria-label', 'Показать перевод предложения');
    this.toggleButton.setAttribute('aria-expanded', 'false');
    this.toggleButton.textContent = '💡';

    this.translationText = document.createElement('div');
    this.translationText.classList.add(styles['text']);
    this.translationText.textContent = translation;

    this.element.append(this.toggleButton, this.translationText);

    this.toggleButton.addEventListener('click', this.handleToggleClick);
  }

  public updateTranslation(translation: string): void {
    this.translationText.textContent = translation;
  }

  private handleToggleClick = (): void => {
    this.isVisible = !this.isVisible;
    this.element.classList.toggle(styles['visible'], this.isVisible);
    this.toggleButton.setAttribute('aria-expanded', String(this.isVisible));
  };
}

export default TranslationHint;
