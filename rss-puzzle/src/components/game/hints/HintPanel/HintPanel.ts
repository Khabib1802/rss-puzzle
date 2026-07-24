import type { ContentHintKind } from '@/types/game.ts';
import BaseComponent from '@/components/BaseComponent';

import TranslationHint from '../TranslationHint/TranslationHint';
import PronunciationHint from '../PronunciationHint/PronunciationHint';

import styles from './HintPanel.module.scss';

class HintPanel extends BaseComponent<HTMLDivElement> {
  private readonly hintContents: {
    translation: TranslationHint;
    pronunciation: PronunciationHint;
  };

  constructor() {
    super('div', [styles.panel]);

    this.hintContents = {
      translation: new TranslationHint(''),
      pronunciation: new PronunciationHint(),
    };

    this.append(this.hintContents.translation, this.hintContents.pronunciation);
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
