import { ClipboardList, type IconNode } from 'lucide';
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

    const title = document.createElement('p');
    title.classList.add(styles.title);
    title.textContent = imageInfo.name;

    const meta = document.createElement('p');
    meta.classList.add(styles.meta);
    meta.textContent = `${imageInfo.author}, ${imageInfo.year}`;

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

    this.append(title, meta, buttonRow);

    requestAnimationFrame(() => {
      this.element.classList.add(styles.visible);
    });
  }
}

export default RoundCompletePanel;
