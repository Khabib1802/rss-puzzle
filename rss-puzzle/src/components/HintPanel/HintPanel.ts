import styles from './HintPanel.module.scss';

import BaseComponent from '../BaseComponent.ts';
import Button from '../Button/Button.ts';
import TranslationHint from '../TranslationHint/TranslationHint.ts';

class HintPanel extends BaseComponent<HTMLDivElement> {
  public readonly toggleButton: Button;

  public readonly translationHint: TranslationHint;

  constructor(initialHintState: boolean) {
    super('div', [styles['panel']]);

    this.toggleButton = new Button(initialHintState ? 'Hint: ON' : 'Hint: OFF', [styles['toggleButton']]);
    this.translationHint = new TranslationHint('');

    this.append(this.toggleButton, this.translationHint);
  }

  public setToggleLabel(isEnabled: boolean): void {
    this.toggleButton.setText(isEnabled ? 'Hint: ON' : 'Hint: OFF');
  }

  public setTranslation(translation: string): void {
    this.translationHint.updateTranslation(translation);
  }

  public setVisible(show: boolean): void {
    this.translationHint.setVisible(show);
  }
}

export default HintPanel;
