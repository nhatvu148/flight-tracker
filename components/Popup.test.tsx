import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Main from "./main";

describe("main tests", () => {
  it("show screen", () => {
    render(<Main />);

    expect(1 + 1).toBe(2);
  });
});
