import type { Point } from '@/utils/dragAndDrop.ts';
import PointerDragController from '@/utils/PointerDragController.ts';
import BaseComponent from '@/components/BaseComponent';

import styles from './WordPuzzle.module.scss';

const TAB_RADIUS = 8;
const TAB_OFFSET = 11;

class WordPuzzle extends BaseComponent<HTMLDivElement> {
  private readonly word: string;

  private readonly wordElement: HTMLDivElement;

  private isSentenceEnd = false;

  private readonly dragController: PointerDragController;

  private dragOffset: Point = { x: 0, y: 0 };

  private ghostElement: HTMLElement | null = null;

  private isFrozen = false;

  private onDragStartCallback: ((point: Point) => void) | null = null;

  private onDragMoveCallback: ((point: Point) => void) | null = null;

  private onDragEndCallback: ((point: Point) => void) | null = null;

  constructor(word: string) {
    super('div', [styles.wordWrapper]);

    this.word = word;

    this.wordElement = document.createElement('div');
    this.wordElement.classList.add(styles.word);
    this.wordElement.textContent = word;
    this.wordElement.style.setProperty('--word-length', String(word.length));
    this.wordElement.style.touchAction = 'none';

    this.element.append(this.wordElement);

    this.dragController = new PointerDragController(this.wordElement, {
      onDragStart: (point) => {
        this.onDragStartCallback?.(point);
        this.startDragVisual(point);
      },
      onDragMove: (point) => {
        this.updateDragVisual(point);
        this.onDragMoveCallback?.(point);
      },
      onDragEnd: (point) => {
        this.endDragVisual();
        this.onDragEndCallback?.(point);
      },
      onDragCancel: () => {
        this.endDragVisual();
      },
    });
  }

  public getWord() {
    return this.word;
  }

  public handleClick(callback: () => void): void {
    this.element.addEventListener('click', () => {
      if (this.isFrozen) return;
      callback();
    });
  }

  public setDragGuard(canDrag: () => boolean): void {
    this.dragController.setDragGuard(canDrag);
  }

  public freeze(): void {
    this.isFrozen = true;
    this.dragController.setDragGuard(() => false);
    this.element.classList.add(styles.frozen);
  }

  public onDragStart(callback: (point: Point) => void): void {
    this.onDragStartCallback = callback;
  }

  public onDragMove(callback: (point: Point) => void): void {
    this.onDragMoveCallback = callback;
  }

  public onDragEnd(callback: (point: Point) => void): void {
    this.onDragEndCallback = callback;
  }

  public setCorrect(): void {
    this.element.classList.add(styles.correct);
  }

  public setIncorrect(): void {
    this.element.classList.add(styles.incorrect);
  }

  public setDimensions(width: number, height: number): void {
    this.wordElement.style.width = `${String(width)}px`;
    this.wordElement.style.height = `${String(height)}px`;
  }

  public setImageSegment(
    imageUrl: string,
    backgroundSize: string,
    positionX: number,
    positionY: number,
    width: number,
    cardHeight: number
  ): void {
    const HALF_DIVISOR = 2;
    const DIAMETER_MULTIPLIER = 2;

    const connectorX = positionX + width + (TAB_OFFSET - TAB_RADIUS * DIAMETER_MULTIPLIER);
    const connectorY = positionY + (cardHeight / HALF_DIVISOR - TAB_RADIUS);

    this.element.style.setProperty('--segment-image', `url('${imageUrl}')`);
    this.element.style.setProperty('--segment-size', backgroundSize);
    this.element.style.setProperty('--segment-position', `-${String(positionX)}px -${String(positionY)}px`);
    this.element.style.setProperty('--segment-connector-position', `-${String(connectorX)}px -${String(connectorY)}px`);
    this.element.classList.add(styles.hasImage);
  }

  public setImageVisible(show: boolean): void {
    this.element.classList.toggle(styles.hasImage, show);
  }

  public reveal(): void {
    this.element.classList.add(styles.revealed);
  }

  public removeHighligh() {
    this.element.classList.remove(styles.correct, styles.incorrect);
    this.wordElement.classList.remove(styles.correct, styles.incorrect);
  }

  private startDragVisual(point: Point): void {
    document.body.classList.add('is-dragging');
    this.element.classList.add(styles.placeholder);

    const ghost = this.element.cloneNode(true) as HTMLElement;
    ghost.classList.remove(styles.placeholder);
    ghost.classList.add(styles.dragging);

    const rect = this.element.getBoundingClientRect();

    this.dragOffset = {
      x: point.x - rect.left,
      y: point.y - rect.top,
    };

    ghost.style.position = 'fixed';
    ghost.style.left = `${String(point.x - this.dragOffset.x)}px`;
    ghost.style.top = `${String(point.y - this.dragOffset.y)}px`;
    ghost.style.margin = '0';
    ghost.style.zIndex = '1000';
    ghost.style.width = `${String(rect.width)}px`;
    ghost.style.height = `${String(rect.height)}px`;

    document.body.append(ghost);
    this.ghostElement = ghost;
  }

  private updateDragVisual(point: Point): void {
    if (!this.ghostElement) return;

    this.ghostElement.style.left = `${String(point.x - this.dragOffset.x)}px`;
    this.ghostElement.style.top = `${String(point.y - this.dragOffset.y)}px`;
  }

  private endDragVisual(): void {
    document.body.classList.remove('is-dragging');
    this.ghostElement?.remove();
    this.ghostElement = null;
    this.element.classList.remove(styles.placeholder);
  }

  public setSentenceEnd(): void {
    this.isSentenceEnd = true;
    this.element.classList.add(styles.noTab);
  }

  public setEdgeState(hideNotch: boolean, hideTab: boolean): void {
    this.wordElement.classList.toggle(styles.noNotch, hideNotch);
    this.element.classList.toggle(styles.noTab, hideTab || this.isSentenceEnd);
  }
}

export default WordPuzzle;
