import React from "react";
import { render } from "@testing-library/react";
import Home, { getServerSideProps } from "../../pages/index";

import { getFlights } from "../../api/flights";
import { FlightData } from "@/types";

describe("The home page", () => {
  it("getServerSideProps returns the correct list of todos from the api", async () => {
    const TEST_TODOS: FlightData[] = [
      {
        aircraft: {
          iataCode: "DA42",
          icao24: "440A8E",
          icaoCode: "DA42",
          regNumber: "OE-FEB",
        },
        airline: {
          iataCode: "",
          icaoCode: "",
        },
        arrival: {
          iataCode: "",
          icaoCode: "",
        },
        departure: {
          iataCode: "",
          icaoCode: "",
        },
        flight: {
          iataNumber: "XXD",
          icaoNumber: "OEFEB",
          number: "XXF",
        },
        geography: {
          altitude: 1912.62,
          direction: 104.39,
          latitude: 47.44,
          longitude: 12.28,
        },
        speed: {
          horizontal: 290.628,
          isGround: 0,
          vspeed: -11.7,
        },
        status: "en-route",
        system: {
          squawk: null,
          updated: 1655454240,
        },
      },
    ];

    jest.spyOn({ getFlights }, "getFlights").mockImplementation(async () => ({
      todos: TEST_TODOS,
    }));

    const response = await getServerSideProps({} as any);

    expect(getFlights).toHaveBeenCalled();
    expect(response).toEqual({
      props: {
        props: {
          dehydratedState: TEST_TODOS,
        },
      },
    });
  });
  // it('Home page renders initial todos correctly', () => {
  //     const TEST_TODOS: TodosQuery['todos'] = [{
  //         id: '1',
  //         title: 'Learn vue'
  //     }, {
  //         id: '2',
  //         title: 'Master react'
  //     }]

  //     const { getByTestId, debug } = render(<Home todos={{ todos: TEST_TODOS }} />)

  //     TEST_TODOS.forEach(todo => {
  //         const todoItem = getByTestId(`todo-${todo?.id}`)

  //         expect(todoItem.textContent).toContain(todo?.title)
  //     })
  // })
});
