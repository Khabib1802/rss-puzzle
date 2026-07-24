import BaseComponent from '@/components/BaseComponent';

import styles from './TranslationHint.module.scss';

class TranslationHint extends BaseComponent<HTMLDivElement> {
  private readonly translationText: HTMLDivElement;

  constructor(translation: string) {
    super('div', [styles['hint']]);

    this.translationText = document.createElement('div');
    this.translationText.classList.add(styles['text']);
    this.translationText.textContent = translation;

    this.element.append(this.translationText);
  }

  public updateTranslation(translation: string): void {
    this.translationText.textContent = translation;
  }

  public setVisible(show: boolean): void {
    this.element.classList.toggle(styles['hidden'], !show);
  }
}

export default TranslationHint;
