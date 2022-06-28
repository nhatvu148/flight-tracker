import { getClosest, isInsideMapBound } from "./functions";

describe("getClosest()", () => {
  const arr = [
    0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240,
    255, 270, 285, 300, 315, 330, 345, 360,
  ];
  it("should yield 15", () => {
    expect(getClosest(arr, 16)).toBe(15);
  });

  it("should yield 315", () => {
    expect(getClosest(arr, 310)).toBe(315);
  });

  it("should yield 90", () => {
    expect(getClosest(arr, 97)).toBe(90);
  });
});

describe("isInsideMapBound()", () => {
  it("should yield true", () => {
    expect(isInsideMapBound(1, 1, 10, 10, 2, 3)).toBe(true);
  });

  it("should yield false", () => {
    expect(isInsideMapBound(1, 1, 10, 10, 2, 12)).toBe(false);
  });

  it("should yield true", () => {
    expect(isInsideMapBound(1, 10, 20, 50, 2, 15)).toBe(true);
  });
});
