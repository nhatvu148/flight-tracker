import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { IMainState } from "redux/types";
import Main from "./main";
import { setTerminator } from "../helpers";
import axios from "axios";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {},
    },
  });

const renderWithClient = (ui: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  const { rerender, ...result } = render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
  );
  return {
    ...result,
    rerender: (rerenderUi: React.ReactElement) =>
      rerender(
        <QueryClientProvider client={testQueryClient}>
          {rerenderUi}
        </QueryClientProvider>
      ),
  };
};

const mockStore = configureStore([]);
jest.mock("../helpers", () => ({
  ...jest.requireActual("../helpers"),
  setTerminator: jest.fn(),
}));

describe("main tests", () => {
  const renderComponent = (state: IMainState) => {
    const store = mockStore({ main: { ...state } });
    const testQueryClient = createTestQueryClient();
    return [
      render(
        <Provider store={store}>
          <QueryClientProvider client={testQueryClient}>
            <Main />
          </QueryClientProvider>
        </Provider>
      ),
      store,
    ];
  };

  afterAll(cleanup);
  it("show screen", async () => {
    const bounds = {
      west: 0,
      east: 0,
      south: 0,
      north: 0,
    };
    const mapCenter = {
      lat: 0,
      lng: 0,
    };
    const zoom = 5;
    const openLayer = "Transport";
    const eFlights = [];
    renderComponent({
      bounds,
      mapCenter,
      zoom,
      openLayer,
      eFlights,
    });

    // const canvas = screen.getByTestId("__next");
    const body = document.getElementsByTagName("body");
    expect(body[0]).toHaveStyle({ padding: "0px;" });

    const title = screen.queryByText("flight");
    expect(title).not.toBeInTheDocument();

    userEvent.hover(body[0]);

    fireEvent.keyDown(document, {
      key: "Escape",
      code: "Escape",
      keyCode: 27,
      charCode: 27,
    });

    const res = await axios.get("http://localhost:3030/hello");

    expect(res.status).toBe(200);
    expect(res.data[0].hello).toBe("world");
    expect(1 + 1).toBe(2);
  });
});
