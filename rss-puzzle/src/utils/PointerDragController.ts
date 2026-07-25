import type { Point } from '@/utils/dragAndDrop.ts';

const DRAG_THRESHOLD = 4;

const DEFAULT_CAN_DRAG = () => true;

interface PointerDragOptions {
  onDragStart?: (point: Point) => void;
  onDragMove?: (point: Point) => void;
  onDragEnd?: (point: Point) => void;
  onDragCancel?: () => void;
}

class PointerDragController {
  private readonly element: HTMLElement;

  private readonly options: PointerDragOptions;

  private isDragging = false;

  private justDragged = false;

  private startPoint: Point = { x: 0, y: 0 };

  private canDrag: () => boolean = DEFAULT_CAN_DRAG;

  constructor(element: HTMLElement, options: PointerDragOptions = {}) {
    this.element = element;
    this.options = options;

    this.element.addEventListener('click', this.suppressClickAfterDrag, true);
    this.element.addEventListener('pointerdown', this.handlePointerDown);
  }

  public setDragGuard(canDrag: () => boolean): void {
    this.canDrag = canDrag;
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
    this.startPoint = { x: event.clientX, y: event.clientY };

    this.element.setPointerCapture(event.pointerId);
    this.element.addEventListener('pointermove', this.handlePointerMove);
    this.element.addEventListener('pointerup', this.handlePointerUp);
    this.element.addEventListener('pointercancel', this.handlePointerCancel);
  };

  private handlePointerMove = (event: PointerEvent): void => {
    const currentPoint: Point = { x: event.clientX, y: event.clientY };

    if (!this.isDragging) {
      const distance = Math.hypot(currentPoint.x - this.startPoint.x, currentPoint.y - this.startPoint.y);
      if (distance < DRAG_THRESHOLD) return;

      this.isDragging = true;
      this.justDragged = true;
      this.options.onDragStart?.(currentPoint);
    }

    this.options.onDragMove?.(currentPoint);
  };

  private handlePointerUp = (event: PointerEvent): void => {
    const wasDragging = this.isDragging;

    this.cleanupDrag(event.pointerId);

    if (wasDragging) {
      this.options.onDragEnd?.({ x: event.clientX, y: event.clientY });
    }
  };

  private handlePointerCancel = (event: PointerEvent): void => {
    const wasDragging = this.isDragging;

    this.cleanupDrag(event.pointerId);

    if (wasDragging) {
      this.options.onDragCancel?.();
    }
  };

  private cleanupDrag(pointerId: number): void {
    if (this.element.hasPointerCapture(pointerId)) {
      this.element.releasePointerCapture(pointerId);
    }
    this.element.removeEventListener('pointermove', this.handlePointerMove);
    this.element.removeEventListener('pointerup', this.handlePointerUp);
    this.element.removeEventListener('pointercancel', this.handlePointerCancel);

    this.isDragging = false;
  }
}

export default PointerDragController;
