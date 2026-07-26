import BaseComponent from '@/components/BaseComponent';
import PronunciationHint from '@/components/game/hints/PronunciationHint/PronunciationHint';
import type { RoundSentenceResult } from '@/types/game';

import styles from './ResultItem.module.scss';

class ResultItem extends BaseComponent<HTMLLIElement> {
  constructor(result: RoundSentenceResult) {
    super('li', [styles.item, result.known ? styles.known : styles.unknown]);

    const sentence = new BaseComponent('span', [styles.sentence]);
    sentence.element.textContent = result.sentence;

    const audioHint = new PronunciationHint();
    audioHint.setAudioSource(result.audio);
    audioHint.setVisible(true);
    audioHint.element.classList.add(styles.audioIcon);

    const badge = new BaseComponent('span', [styles.badge]);
    badge.element.textContent = result.known ? 'Known' : 'Unknown';

    const meta = new BaseComponent('div', [styles.meta]);
    meta.append(audioHint, badge);

    this.append(sentence, meta);
  }
}

export default ResultItem;
