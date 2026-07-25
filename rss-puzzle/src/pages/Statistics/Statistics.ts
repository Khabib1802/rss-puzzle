import BaseComponent from '@/components/BaseComponent.ts';
import Button from '@/components/ui/Button/Button.ts';
import gameService from '@/services/gameService.ts';
import type { RoundSentenceResult } from '@/types/game.ts';

import styles from './Statistics.module.scss';

class Statistics extends BaseComponent<HTMLDivElement> {
  private continueButton: Button;

  constructor() {
    super('div', ['wrapper', styles.page]);

    const title = new BaseComponent('h1', [styles.title]);
    title.element.textContent = 'Round results';

    const roundResults = gameService.getRoundResults();
    const knownResults = roundResults.filter((result) => result.known);
    const unknownResults = roundResults.filter((result) => !result.known);

    const sections: BaseComponent[] = [];
    const knownSection = Statistics.buildSection('I know', knownResults, styles.known);
    const unknownSection = Statistics.buildSection("I don't know", unknownResults, styles.unknown);
    if (knownSection) sections.push(knownSection);
    if (unknownSection) sections.push(unknownSection);

    const hasNextStep = gameService.getRoundHasNextStep();
    this.continueButton = new Button(hasNextStep ? 'Continue' : 'Home', [styles.continueButton]);

    this.setupEvents(hasNextStep);
    this.append(title, ...sections, this.continueButton);
  }

  private static buildSection(
    heading: string,
    results: RoundSentenceResult[],
    modifierClass: string
  ): BaseComponent | null {
    if (results.length === 0) return null;

    const section = new BaseComponent('section', [styles.section, modifierClass]);

    const sectionTitle = new BaseComponent('h2', [styles.sectionTitle]);
    sectionTitle.element.textContent = heading;

    const list = new BaseComponent('ul', [styles.list]);
    results.forEach(({ sentence, known }) => {
      const item = new BaseComponent('li', [styles.item, known ? styles.known : styles.unknown]);
      const sentenceText = new BaseComponent('span', [styles.sentence]);
      sentenceText.element.textContent = sentence;
      const badge = new BaseComponent('span', [styles.badge]);
      badge.element.textContent = known ? 'Known' : 'Unknown';
      item.append(sentenceText, badge);
      list.append(item);
    });

    section.append(sectionTitle, list);
    return section;
  }

  private setupEvents(hasNextStep: boolean): void {
    this.continueButton.handleClick(() => {
      window.location.hash = hasNextStep ? '/game' : '/';
    });
  }
}

export default Statistics;
