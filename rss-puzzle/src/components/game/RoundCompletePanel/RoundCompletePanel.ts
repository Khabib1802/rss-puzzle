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

  constructor(imageInfo: ImageInfo, actionLabel: string) {
    super('div', [styles.panel]);

    const title = document.createElement('p');
    title.classList.add(styles.title);
    title.textContent = imageInfo.name;

    const meta = document.createElement('p');
    meta.classList.add(styles.meta);
    meta.textContent = `${imageInfo.author}, ${imageInfo.year}`;

    this.actionButton = new Button(actionLabel, [styles.actionButton]);

    this.append(title, meta, this.actionButton);

    requestAnimationFrame(() => {
      this.element.classList.add(styles.visible);
    });
  }
}

export default RoundCompletePanel;
