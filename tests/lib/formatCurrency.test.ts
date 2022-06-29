import { formatCurrency } from "./formatCurrency";

it("adds a dollar sign at the start", () => {
  expect(formatCurrency(6)).toContain("$6");
  expect(formatCurrency(14)).toContain("$14");
});

it("supports decimals", () => {
  expect(formatCurrency(5.99)).toContain("5.99");
});
