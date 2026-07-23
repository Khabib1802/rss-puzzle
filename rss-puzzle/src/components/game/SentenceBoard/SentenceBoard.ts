import styles from './SentenceBoard.module.scss';

import BaseComponent from '../../BaseComponent.ts';

type ContainerId = 'source' | 'result';

class SentenceBoard extends BaseComponent<HTMLDivElement> {
  public readonly sourceBlock: BaseComponent<HTMLDivElement>;

  public readonly resultBlock: BaseComponent<HTMLDivElement>;

  constructor() {
    super('div', [styles['board']]);

    this.resultBlock = new BaseComponent('div', [styles['result']]);
    this.sourceBlock = new BaseComponent('div', [styles['source']]);

    this.append(this.resultBlock, this.sourceBlock);
  }

  public clear(): void {
    this.resultBlock.element.replaceChildren();
    this.sourceBlock.element.replaceChildren();
  }

  public setDropTarget(id: ContainerId | null): void {
    this.sourceBlock.element.classList.toggle(styles['dropTarget'], id === 'source');
    this.resultBlock.element.classList.toggle(styles['dropTarget'], id === 'result');
  }

  public getContainers(): { id: ContainerId; rect: DOMRect }[] {
    return [
      { id: 'source', rect: this.sourceBlock.element.getBoundingClientRect() },
      { id: 'result', rect: this.resultBlock.element.getBoundingClientRect() },
    ];
  }
}

export default SentenceBoard;
