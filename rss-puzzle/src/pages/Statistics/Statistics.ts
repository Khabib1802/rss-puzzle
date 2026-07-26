import BaseComponent from '@/components/BaseComponent.ts';
import Button from '@/components/ui/Button/Button.ts';
import ResultsList from '@/components/statistics/ResultsList/ResultsList.ts';
import gameService from '@/services/gameService.ts';
import type { RoundSentenceResult } from '@/types/game.ts';
import { ArrowRight, CheckCheck } from 'lucide';
import styles from './Statistics.module.scss';

class Statistics extends BaseComponent<HTMLDivElement> {
  private continueButton: Button;

  constructor() {
    super('div', ['wrapper']);

    const title = new BaseComponent('h1', [styles.title]);
    title.element.textContent = 'Round results';

    const artwork = gameService.getRoundArtwork();
    const artworkBlock = artwork ? Statistics.buildArtworkBlock(artwork) : null;

    const roundResults = gameService.getRoundResults();
    const knownResults = roundResults.filter((result) => result.known);
    const unknownResults = roundResults.filter((result) => !result.known);

    const sections: BaseComponent[] = [];
    const knownSection = Statistics.buildSection('I know', knownResults, styles.known);
    const unknownSection = Statistics.buildSection("I don't know", unknownResults, styles.unknown);
    if (knownSection) sections.push(knownSection);
    if (unknownSection) sections.push(unknownSection);

    const hasNextStep = gameService.getRoundHasNextStep();
    this.continueButton = new Button({
      text: hasNextStep ? 'Continue' : 'Finish',
      variant: 'primary',
      icon: hasNextStep ? ArrowRight : CheckCheck,
      iconPosition: 'right',
    });

    this.setupEvents(hasNextStep);

    const children: (BaseComponent | HTMLElement)[] = artworkBlock ? [artworkBlock] : [];
    this.append(title, ...children, ...sections, this.continueButton);
  }

  private static buildArtworkBlock(artwork: {
    src: string;
    name: string;
    author: string;
    year: string;
  }): BaseComponent {
    const block = new BaseComponent('figure', [styles.artwork]);

    const image = new BaseComponent<HTMLImageElement>('img', [styles.artworkImage]);
    image.element.src = artwork.src;
    image.element.alt = artwork.name;

    const caption = new BaseComponent('figcaption', [styles.artworkCaption]);
    caption.element.textContent = `${artwork.name} — ${artwork.author}, ${artwork.year}`;

    block.append(image, caption);
    return block;
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

    const list = new ResultsList(results);

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
