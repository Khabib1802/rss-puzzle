import styles from './WordPuzzle.module.scss';

import BaseComponent from '../BaseComponent.ts';
import type { Point } from '../../utils/dragAndDrop.ts';

const DRAG_THRESHOLD = 4;

const DEFAULT_CAN_DRAG = () => true;

class WordPuzzle extends BaseComponent<HTMLDivElement> {
  private readonly word: string;

  private isDragging = false;

  private justDragged = false;

  private startPoint: Point = { x: 0, y: 0 };

  private dragOffset: Point = { x: 0, y: 0 };

  private canDrag: () => boolean = DEFAULT_CAN_DRAG;

  private onDragStartCallback: ((point: Point) => void) | null = null;

  private onDragMoveCallback: ((point: Point) => void) | null = null;

  private onDragEndCallback: ((point: Point) => void) | null = null;

  constructor(word: string) {
    super('div', [styles['word']]);

    this.word = word;
    this.element.textContent = word;

    this.element.style.setProperty('--word-length', String(word.length));
    this.element.style.touchAction = 'none';

    this.element.addEventListener('click', this.supppressClickAfterDrag, true);
    this.element.addEventListener('pointerdown', this.handlePointerDown);
  }

  public getWord() {
    return this.word;
  }

  public handleClick(callback: () => void): void {
    this.element.addEventListener('click', callback);
  }

  public setDragGuard(canDrag: () => boolean): void {
    this.canDrag = canDrag;
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

  private supppressClickAfterDrag = (event: MouseEvent): void => {
    if (this.justDragged) {
      event.stopImmediatePropagation();
      this.justDragged = false;
    }
  };

  private handlePointerDown = (event: PointerEvent): void => {
    if (!this.canDrag()) return;

    this.justDragged = false;

    const rect = this.element.getBoundingClientRect();

    this.startPoint = { x: event.clientX, y: event.clientY };
    this.dragOffset = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    this.element.setPointerCapture(event.pointerId);

    this.element.addEventListener('pointermove', this.handlePointerMove);
    this.element.addEventListener('pointerup', this.handlePointerUp);
  };

  private handlePointerMove = (event: PointerEvent): void => {
    const currentPoint: Point = { x: event.clientX, y: event.clientY };

    if (!this.isDragging) {
      const distance = Math.hypot(currentPoint.x - this.startPoint.x, currentPoint.y - this.startPoint.y);

      if (distance < DRAG_THRESHOLD) return;

      this.isDragging = true;
      this.justDragged = true;

      this.element.classList.add(styles['dragging']);

      this.onDragStartCallback?.(currentPoint);
    }

    this.element.style.left = `${String(currentPoint.x - this.dragOffset.x)}px`;
    this.element.style.top = `${String(currentPoint.y - this.dragOffset.y)}px`;

    this.onDragMoveCallback?.(currentPoint);
  };

  private handlePointerUp = (event: PointerEvent): void => {
    this.cleanupDrag(event.pointerId);

    if (this.isDragging) {
      this.onDragEndCallback?.({ x: event.clientX, y: event.clientY });
    }

    this.isDragging = false;
  };

  private handlePointerCancel = (event: PointerEvent): void => {
    this.cleanupDrag(event.pointerId);
    this.isDragging = false;
  };

  public setCorrect(): void {
    this.element.classList.add(styles['correct']);
  }

  public setIncorrect(): void {
    this.element.classList.add(styles['incorrect']);
  }

  public removeHighligh() {
    this.element.classList.remove(styles['correct'], styles['incorrect']);
  }

  private resetDragStyles(): void {
    this.element.classList.remove(styles['dragging']);
    this.element.style.removeProperty('left');
    this.element.style.removeProperty('top');
  }

  private cleanupDrag(pointerId: number): void {
    if (this.element.hasPointerCapture(pointerId)) {
      this.element.releasePointerCapture(pointerId);
    }
    this.element.removeEventListener('pointermove', this.handlePointerMove);
    this.element.removeEventListener('pointerup', this.handlePointerUp);
    this.element.removeEventListener('pointercancel', this.handlePointerCancel);

    if (this.isDragging) {
      this.resetDragStyles();
    }
  }
}

export default WordPuzzle;
