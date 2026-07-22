import { describe, it, expect } from 'vitest';
import { findContainerAtPoint, getInsertionIndex } from './dragAndDrop.ts';
import type { Rect } from './dragAndDrop.ts';

describe('findContainerAtPoint', () => {
  const containers = [
    { id: 'source' as const, rect: { top: 0, right: 100, bottom: 50, left: 0 } },
    { id: 'result' as const, rect: { top: 60, right: 100, bottom: 110, left: 0 } },
  ];

  it('returns the container id when the point is inside it', () => {
    expect(findContainerAtPoint({ x: 50, y: 25 }, containers)).toBe('source');
    expect(findContainerAtPoint({ x: 50, y: 80 }, containers)).toBe('result');
  });

  it('returns null when the point is in the gap between containers', () => {
    expect(findContainerAtPoint({ x: 50, y: 55 }, containers)).toBeNull();
  });

  it('returns null when the point is outside all containers', () => {
    expect(findContainerAtPoint({ x: 500, y: 500 }, containers)).toBeNull();
  });
});

describe('getInsertionIndex', () => {
  const row: Rect[] = [
    { top: 0, bottom: 30, left: 0, right: 50 },
    { top: 0, bottom: 30, left: 50, right: 100 },
    { top: 0, bottom: 30, left: 100, right: 150 },
  ];

  it('inserts before the first card when pointer is left of it', () => {
    expect(getInsertionIndex({ x: 10, y: 15 }, row)).toBe(0);
  });

  it('inserts between two cards in the same row', () => {
    expect(getInsertionIndex({ x: 60, y: 15 }, row)).toBe(1);
  });

  it('inserts at the end when pointer is past the last card', () => {
    expect(getInsertionIndex({ x: 200, y: 15 }, row)).toBe(row.length);
  });

  it('inserts after the last card of a row when pointer is past it horizontally', () => {
    const twoRows: Rect[] = [
      { top: 0, bottom: 30, left: 0, right: 50 },
      { top: 40, bottom: 70, left: 0, right: 50 },
    ];

    expect(getInsertionIndex({ x: 200, y: 10 }, twoRows)).toBe(1);
  });

  it('returns 0 for an empty container', () => {
    expect(getInsertionIndex({ x: 10, y: 10 }, [])).toBe(0);
  });
});
