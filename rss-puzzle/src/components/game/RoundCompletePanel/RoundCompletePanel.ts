import { ClipboardList, createElement, Sparkles, type IconNode } from 'lucide';
import BaseComponent from '@/components/BaseComponent';
import Button from '@/components/ui/Button/Button.ts';

import styles from './RoundCompletePanel.module.scss';

interface ImageInfo {
  name: string;
  author: string;
  year: string;
}

class RoundCompletePanel extends BaseComponent<HTMLDivElement> {
  public readonly actionButton: Button;

  public readonly resultsButton: Button;

  constructor(imageInfo: ImageInfo, actionText: string, actionIcon: IconNode) {
    super('div', [styles.panel]);

    const eyebrowIcon = createElement(Sparkles);
    eyebrowIcon.classList.add(styles.eyebrowIcon);
    const eyebrowText = document.createElement('span');
    eyebrowText.textContent = 'Round complete';
    const eyebrow = document.createElement('p');
    eyebrow.classList.add(styles.eyebrow);
    eyebrow.append(eyebrowIcon, eyebrowText);

    const title = document.createElement('p');
    title.classList.add(styles.title);
    title.textContent = imageInfo.name;

    const meta = document.createElement('p');
    meta.classList.add(styles.meta);
    meta.textContent = `${imageInfo.author} · ${imageInfo.year}`;

    const divider = document.createElement('div');
    divider.classList.add(styles.divider);

    const buttonRow = new BaseComponent('div', [styles.buttonRow]);
    this.resultsButton = new Button({
      text: 'Results',
      variant: 'secondary',
      icon: ClipboardList,
      iconPosition: 'right',
    });
    this.actionButton = new Button({
      text: actionText,
      variant: 'primary',
      icon: actionIcon,
      iconPosition: 'right',
    });
    buttonRow.append(this.resultsButton, this.actionButton);

    this.append(eyebrow, title, meta, divider, buttonRow);

    requestAnimationFrame(() => {
      this.element.classList.add(styles.visible);
    });
  }
}

export default RoundCompletePanel;
