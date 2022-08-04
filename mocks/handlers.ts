import { rest } from "msw";

export const handlers = [
  rest.get("http://localhost:3030/hello", (req, res, ctx) => {
    return res(ctx.json([{ hello: "world" }]));
  }),
];
