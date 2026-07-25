import BaseComponent from '@/components/BaseComponent.ts';
import Button from '@/components/ui/Button/Button.ts';
import gameService from '@/services/gameService.ts';

import styles from './Statistics.module.scss';

class Statistics extends BaseComponent<HTMLDivElement> {
  private continueButton: Button;

  constructor() {
    super('div', ['wrapper', styles.page]);

    const title = new BaseComponent('h1', [styles.title]);
    title.element.textContent = 'Round results';

    const list = new BaseComponent('ul', [styles.list]);
    const roundResults = gameService.getRoundResults();

    roundResults.forEach(({ sentence, known }) => {
      const item = new BaseComponent('li', [styles.item, known ? styles.known : styles.unknown]);
      const sentenceText = new BaseComponent('span', [styles.sentence]);
      sentenceText.element.textContent = sentence;
      const badge = new BaseComponent('span', [styles.badge]);
      badge.element.textContent = known ? 'Known' : 'Unknown';
      item.append(sentenceText, badge);
      list.append(item);
    });

    const hasNextStep = gameService.getRoundHasNextStep();
    this.continueButton = new Button(hasNextStep ? 'Continue' : 'Home', [styles.continueButton]);

    this.setupEvents(hasNextStep);
    this.append(title, list, this.continueButton);
  }

  private setupEvents(hasNextStep: boolean): void {
    this.continueButton.handleClick(() => {
      window.location.hash = hasNextStep ? '/game' : '/';
    });
  }
}

export default Statistics;
