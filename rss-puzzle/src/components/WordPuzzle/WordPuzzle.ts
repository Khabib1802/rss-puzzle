import styles from './WordPuzzle.module.scss';

import BaseComponent from '../BaseComponent.ts';
import type { Point } from '../../utils/dragAndDrop.ts';

const DRAG_THRESHOLD = 4;

const DEFAULT_CAN_DRAG = () => true;

const TAB_RADIUS = 8;
const TAB_OFFSET = 11;

class WordPuzzle extends BaseComponent<HTMLDivElement> {
  private readonly word: string;

  private readonly wordElement: HTMLDivElement;

  private isSentenceEnd = false;

  private isDragging = false;

  private justDragged = false;

  private startPoint: Point = { x: 0, y: 0 };

  private dragOffset: Point = { x: 0, y: 0 };

  private ghostElement: HTMLElement | null = null;

  private canDrag: () => boolean = DEFAULT_CAN_DRAG;

  private isFrozen = false;

  private onDragStartCallback: ((point: Point) => void) | null = null;

  private onDragMoveCallback: ((point: Point) => void) | null = null;

  private onDragEndCallback: ((point: Point) => void) | null = null;

  constructor(word: string) {
    super('div', [styles['wordWrapper']]);

    this.word = word;

    this.wordElement = document.createElement('div');
    this.wordElement.classList.add(styles['word']);
    this.wordElement.textContent = word;
    this.wordElement.style.setProperty('--word-length', String(word.length));
    this.wordElement.style.touchAction = 'none';

    this.element.append(this.wordElement);

    this.wordElement.addEventListener('click', this.suppressClickAfterDrag, true);
    this.wordElement.addEventListener('pointerdown', this.handlePointerDown);
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
    this.canDrag = canDrag;
  }

  public freeze(): void {
    this.isFrozen = true;
    this.canDrag = () => false;
    this.element.classList.add(styles['frozen']);
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
    this.element.classList.add(styles['correct']);
  }

  public setIncorrect(): void {
    this.element.classList.add(styles['incorrect']);
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
    this.element.classList.add(styles['hasImage']);
  }

  public setImageVisible(show: boolean): void {
    this.element.classList.toggle(styles['hasImage'], show);
  }

  public removeHighligh() {
    this.element.classList.remove(styles['correct'], styles['incorrect']);
    this.wordElement.classList.remove(styles['correct'], styles['incorrect']);
  }

  private suppressClickAfterDrag = (event: MouseEvent): void => {
    if (this.justDragged) {
      event.stopImmediatePropagation();
      this.justDragged = false;
    }
  };

  private handlePointerDown = (event: PointerEvent): void => {
    if (!this.canDrag()) return;

    this.justDragged = false;

    const rect = this.wordElement.getBoundingClientRect();

    this.startPoint = { x: event.clientX, y: event.clientY };
    this.dragOffset = { x: event.clientX - rect.left, y: event.clientY - rect.top };

    this.wordElement.setPointerCapture(event.pointerId);
    this.wordElement.addEventListener('pointermove', this.handlePointerMove);
    this.wordElement.addEventListener('pointerup', this.handlePointerUp);
    this.wordElement.addEventListener('pointercancel', this.handlePointerCancel);
  };

  private handlePointerMove = (event: PointerEvent): void => {
    const currentPoint: Point = { x: event.clientX, y: event.clientY };

    if (!this.isDragging) {
      const distance = Math.hypot(currentPoint.x - this.startPoint.x, currentPoint.y - this.startPoint.y);
      if (distance < DRAG_THRESHOLD) return;

      this.isDragging = true;
      this.justDragged = true;
      this.onDragStartCallback?.(currentPoint);
      this.startDragVisual(currentPoint);
    }

    this.updateDragVisual(currentPoint);
    this.onDragMoveCallback?.(currentPoint);
  };

  private handlePointerUp = (event: PointerEvent): void => {
    const wasDragging = this.isDragging;

    this.cleanupDrag(event.pointerId);

    if (wasDragging) {
      this.onDragEndCallback?.({ x: event.clientX, y: event.clientY });
    }
  };

  private cleanupDrag(pointerId: number): void {
    if (this.wordElement.hasPointerCapture(pointerId)) {
      this.wordElement.releasePointerCapture(pointerId);
    }
    this.wordElement.removeEventListener('pointermove', this.handlePointerMove);
    this.wordElement.removeEventListener('pointerup', this.handlePointerUp);
    this.wordElement.removeEventListener('pointercancel', this.handlePointerCancel);

    if (this.isDragging) {
      this.endDragVisual();
    }

    this.isDragging = false;
  }

  private startDragVisual(point: Point): void {
    document.body.classList.add('is-dragging');
    this.element.classList.add(styles['placeholder']);

    const ghost = this.element.cloneNode(true) as HTMLElement;
    ghost.classList.remove(styles['placeholder']);
    ghost.classList.add(styles['dragging']);

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
    this.element.classList.remove(styles['placeholder']);
  }

  public setSentenceEnd(): void {
    this.isSentenceEnd = true;
    this.element.classList.add(styles['noTab']);
  }

  public setEdgeState(hideNotch: boolean, hideTab: boolean): void {
    this.wordElement.classList.toggle(styles['noNotch'], hideNotch);
    this.element.classList.toggle(styles['noTab'], hideTab || this.isSentenceEnd);
  }

  private handlePointerCancel = (event: PointerEvent): void => {
    this.cleanupDrag(event.pointerId);
  };
}

export default WordPuzzle;
