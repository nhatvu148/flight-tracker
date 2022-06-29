import { transformToNumber } from "./numbers";

it("should transform a string number to a number of type number", () => {
  const input = "1";

  const result = transformToNumber(input);

  expect(typeof result).toBe("number");
});

it("should yield NaN for non-transformable values", () => {
  const input = "invalid";

  const result = transformToNumber(input);

  expect(result).toBeNaN();
});
