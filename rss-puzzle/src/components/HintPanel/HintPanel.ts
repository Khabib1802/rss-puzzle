import styles from './HintPanel.module.scss';

import BaseComponent from '../BaseComponent.ts';
import Button from '../Button/Button.ts';
import TranslationHint from '../TranslationHint/TranslationHint.ts';
import PronunciationHint from '../PronunciationHint/PronunciationHint.ts';

class HintPanel extends BaseComponent<HTMLDivElement> {
  public readonly toggleButton: Button;

  public readonly translationHint: TranslationHint;

  public readonly pronunciationToggleButton: Button;

  private readonly pronunciationHint: PronunciationHint;

  constructor(initialTranslationHintState: boolean, initialPronunciationHintState: boolean) {
    super('div', [styles['panel']]);

    this.toggleButton = new Button(initialTranslationHintState ? 'Hint: ON' : 'Hint: OFF', [styles['toggleButton']]);
    this.pronunciationToggleButton = new Button(initialPronunciationHintState ? 'Audio hint: ON' : 'Audio hint: OFF', [
      styles['toggleButton'],
    ]);

    this.translationHint = new TranslationHint('');
    this.pronunciationHint = new PronunciationHint();

    this.append(this.toggleButton, this.pronunciationToggleButton, this.translationHint, this.pronunciationHint);
  }

  public setToggleLabel(isEnabled: boolean): void {
    this.toggleButton.setText(isEnabled ? 'Hint: ON' : 'Hint: OFF');
  }

  public setPronunciationToggleLabel(isEnabled: boolean): void {
    this.pronunciationToggleButton.setText(isEnabled ? 'Audio hint: ON' : 'Audio hint: OFF');
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

  public setPronunciationVisible(show: boolean): void {
    this.pronunciationHint.setVisible(show);
  }
}

export default HintPanel;
