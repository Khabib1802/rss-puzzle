import BaseComponent from '@/components/BaseComponent';

import styles from './ResumeBanner.module.scss';

const AUTO_HIDE_DELAY_MS = 4000;

class ResumeBanner extends BaseComponent<HTMLDivElement> {
  constructor(level: number, roundNumber: number) {
    super('div', [styles.banner]);
    this.element.textContent = `Continuing from Level ${String(level)}, Round ${String(roundNumber)}`;

    setTimeout(() => {
      this.element.classList.add(styles.hidden);
    }, AUTO_HIDE_DELAY_MS);
  }
}

export default ResumeBanner;
