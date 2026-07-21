interface Point {
  x: number;
  y: number;
}

interface Rect {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

function isPointInRect(point: Point, rect: Rect): boolean {
  return point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
}

function findContainerAtPoint<T extends string>(point: Point, containers: { id: T; rect: Rect }[]): T | null {
  const container = containers.find(({ rect }) => isPointInRect(point, rect));

  return container ? container.id : null;
}

function getInsertionIndex(point: Point, itemRects: Rect[]): number {
  const HALF_DIVIDER = 2;

  const index = itemRects.findIndex((rect) => {
    const isEarlierRow = point.y < rect.top;
    const isSameRow = point.y >= rect.top && point.y <= rect.bottom;
    const isBeforeInRow = isSameRow && point.x < (rect.left + rect.right) / HALF_DIVIDER;

    return isEarlierRow || isBeforeInRow;
  });

  return index === -1 ? itemRects.length : index;
}

export { findContainerAtPoint, getInsertionIndex };
export type { Point, Rect };
