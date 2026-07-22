import styles from './HintPanel.module.scss';

import BaseComponent from '../BaseComponent.ts';
import Button from '../Button/Button.ts';
import TranslationHint from '../TranslationHint/TranslationHint.ts';
import PronunciationHint from '../PronunciationHint/PronunciationHint.ts';

class HintPanel extends BaseComponent<HTMLDivElement> {
  public readonly toggleButton: Button;

  public readonly translationHint: TranslationHint;

  private readonly pronunciationHint: PronunciationHint;

  constructor(initialHintState: boolean) {
    super('div', [styles['panel']]);

    this.toggleButton = new Button(initialHintState ? 'Hint: ON' : 'Hint: OFF', [styles['toggleButton']]);
    this.translationHint = new TranslationHint('');
    this.pronunciationHint = new PronunciationHint();

    this.append(this.toggleButton, this.translationHint, this.pronunciationHint);
  }

  public setToggleLabel(isEnabled: boolean): void {
    this.toggleButton.setText(isEnabled ? 'Hint: ON' : 'Hint: OFF');
  }

  public setTranslation(translation: string): void {
    this.translationHint.updateTranslation(translation);
  }

  public setAudioSource(src: string): void {
    this.pronunciationHint.setAudioSource(src);
  }

  public stopAudio(): void {
    this.pronunciationHint.stop();
  }

  public setVisible(show: boolean): void {
    this.translationHint.setVisible(show);
  }
}

export default HintPanel;
