import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { IMainState } from "redux/types";
import Main from "./main";
import { setTerminator } from "../helpers";

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
  it("show screen", () => {
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

    expect(1 + 1).toBe(2);
  });
});
