import BaseComponent from '@/components/BaseComponent';
import styles from './SentenceBoard.module.scss';

type ContainerId = 'source' | 'result';

class SentenceBoard extends BaseComponent<HTMLDivElement> {
  public readonly sourceBlock: BaseComponent<HTMLDivElement>;

  public readonly resultBlock: BaseComponent<HTMLDivElement>;

  private readonly pictureArea: BaseComponent<HTMLDivElement>;

  constructor() {
    super('div', [styles.board]);

    this.pictureArea = new BaseComponent('div', [styles.pictureArea]);
    this.resultBlock = new BaseComponent('div', [styles.result]);
    this.sourceBlock = new BaseComponent('div', [styles.source]);

    this.pictureArea.append(this.resultBlock);
    this.append(this.pictureArea, this.sourceBlock);
  }

  public clear(): void {
    this.resultBlock.element.replaceChildren();
    this.sourceBlock.element.replaceChildren();
  }

  public clearPicture(): void {
    this.pictureArea.element.replaceChildren(this.resultBlock.element);
    this.pictureArea.element.style.minHeight = '';
    this.element.style.removeProperty('--board-width');
  }

  public reservePictureHeight(px: number): void {
    this.pictureArea.element.style.minHeight = `${String(px)}px`;
  }

  public growPictureHeight(px: number): void {
    const current = this.pictureArea.element.style.minHeight;
    const currentPx = current ? parseFloat(current) : 0;
    this.pictureArea.element.style.minHeight = `${String(currentPx + px)}px`;
  }

  public freezeCurrentResultRow(): void {
    if (this.resultBlock.element.children.length === 0) return;

    const row = document.createElement('div');
    row.classList.add(styles.historyRow);
    row.append(...Array.from(this.resultBlock.element.children));
    this.pictureArea.element.insertBefore(row, this.resultBlock.element);
  }

  public getReferenceWidth(): number {
    return this.resultBlock.element.getBoundingClientRect().width;
  }

  public getMaxAllowedWidth(): number {
    return this.element.getBoundingClientRect().width;
  }

  public setBoardWidth(px: number): void {
    this.element.style.setProperty('--board-width', `${String(px)}px`);
  }

  public setDropTarget(id: ContainerId | null): void {
    this.sourceBlock.element.classList.toggle(styles.dropTarget, id === 'source');
    this.resultBlock.element.classList.toggle(styles.dropTarget, id === 'result');
  }

  public getContainers(): { id: ContainerId; rect: DOMRect }[] {
    return [
      { id: 'source', rect: this.sourceBlock.element.getBoundingClientRect() },
      { id: 'result', rect: this.resultBlock.element.getBoundingClientRect() },
    ];
  }

  public setCurrentRowNumber(n: number): void {
    this.resultBlock.element.dataset['row'] = String(n);
  }

  public setCardHeight(px: number): void {
    this.element.style.setProperty('--card-height', `${String(px)}px`);
  }
}

export default SentenceBoard;
