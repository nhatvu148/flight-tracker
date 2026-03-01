/**
 * Snap a compass heading (0-360) to the nearest pre-rendered SVG angle.
 * The SVGs are rendered every 15 degrees: 0, 15, 30, ..., 345, 360.
 */
export function getClosest(arr: readonly number[], goal: number): number {
  return arr.reduce((prev, curr) =>
    Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev
  );
}

/**
 * Check if a point (x, y) is inside a bounding box.
 */
export function isInsideMapBound(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x: number,
  y: number
): boolean {
  return x > x1 && x < x2 && y > y1 && y < y2;
}

/**
 * Safe localStorage check for SSR.
 */
export function getFromStorage(key: string): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
}

/**
 * Safe localStorage set for SSR.
 */
export function setToStorage(key: string, value: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, value);
}
