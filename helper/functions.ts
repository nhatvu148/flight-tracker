export const isInsideMapBound = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x: number,
  y: number
) => {
  if (x > x1 && x < x2 && y > y1 && y < y2) return true;

  return false;
};

export const checkLocalStorage = (key: string) => {
  return (
    typeof window !== "undefined" &&
    !!window.localStorage.getItem(key)
  );
};
