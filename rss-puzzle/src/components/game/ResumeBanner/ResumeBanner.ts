import { createElement, History } from 'lucide';
import BaseComponent from '@/components/BaseComponent';

import styles from './ResumeBanner.module.scss';

const AUTO_HIDE_DELAY_MS = 4000;
const HIDE_TRANSITION_MS = 300;

class ResumeBanner extends BaseComponent<HTMLDivElement> {
  constructor(level: number, roundNumber: number) {
    super('div', [styles.banner]);

    const icon = createElement(History);
    icon.classList.add(styles.icon);

    const text = document.createElement('span');
    text.textContent = `Continuing from Level ${String(level)}, Round ${String(roundNumber)}`;

    this.element.append(icon, text);

    setTimeout(() => {
      this.element.classList.add(styles.hidden);
      setTimeout(() => {
        this.element.remove();
      }, HIDE_TRANSITION_MS);
    }, AUTO_HIDE_DELAY_MS);
  }
}

export default ResumeBanner;
