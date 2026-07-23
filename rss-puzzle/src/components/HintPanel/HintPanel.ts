import styles from './HintPanel.module.scss';

import BaseComponent from '../BaseComponent.ts';
import Button from '../Button/Button.ts';
import TranslationHint from '../TranslationHint/TranslationHint.ts';
import PronunciationHint from '../PronunciationHint/PronunciationHint.ts';
import type { ContentHintKind, HintKind } from '../../types/game.ts';
import { HINT_KINDS } from '../../constants.ts';

const TOGGLE_LABELS: Record<HintKind, string> = {
  translation: 'Hint',
  pronunciation: 'Audio hint',
  image: 'Image hint',
};

class HintPanel extends BaseComponent<HTMLDivElement> {
  private readonly toggleButtons: Record<HintKind, Button>;

  private readonly hintContents: {
    translation: TranslationHint;
    pronunciation: PronunciationHint;
  };

  constructor(initialHintStates: Record<HintKind, boolean>) {
    super('div', [styles['panel']]);

    this.toggleButtons = {
      translation: HintPanel.createToggleButton(HINT_KINDS.TRANSLATION, initialHintStates.translation),
      pronunciation: HintPanel.createToggleButton(HINT_KINDS.PRONUNCIATION, initialHintStates.pronunciation),
      image: HintPanel.createToggleButton('image', initialHintStates.image),
    };

    this.hintContents = {
      translation: new TranslationHint(''),
      pronunciation: new PronunciationHint(),
    };

    this.append(
      this.toggleButtons.translation,
      this.toggleButtons.pronunciation,
      this.toggleButtons.image,
      this.hintContents.translation,
      this.hintContents.pronunciation
    );
  }

  private static createToggleButton(kind: HintKind, initialState: boolean): Button {
    return new Button(HintPanel.getToggleLabel(kind, initialState), [styles['toggleButton']]);
  }

  private static getToggleLabel(kind: HintKind, isEnabled: boolean): string {
    return `${TOGGLE_LABELS[kind]}: ${isEnabled ? 'ON' : 'OFF'}`;
  }

  public getToggleButton(kind: HintKind): Button {
    return this.toggleButtons[kind];
  }

  public setToggleLabel(kind: HintKind, isEnabled: boolean): void {
    this.toggleButtons[kind].setText(HintPanel.getToggleLabel(kind, isEnabled));
  }

  public setHintVisible(kind: ContentHintKind, show: boolean): void {
    this.hintContents[kind].setVisible(show);
  }

  public setTranslation(translation: string): void {
    this.hintContents.translation.updateTranslation(translation);
  }

  public setAudioSource(src: string): void {
    this.hintContents.pronunciation.setAudioSource(src);
  }

  public stopAudio(): void {
    this.hintContents.pronunciation.stop();
  }
}

export default HintPanel;
