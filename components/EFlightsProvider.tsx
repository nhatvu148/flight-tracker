import { createContext, useContext, ReactNode, useReducer } from "react";

type EFlightsProviderProps = { children: ReactNode };

const EFlightsStateContext = createContext(null);

const EFlightsProvider = ({ children }: EFlightsProviderProps): JSX.Element => {
  const initialState = {
    eFlights: [],
  };

  const [state, dispatch] = useReducer(eFlightsReducer, initialState);

  return (
    <EFlightsStateContext.Provider value={{ state: state, dispatch }}>
      {children}
    </EFlightsStateContext.Provider>
  );
};

const useEFlights = () => {
  const { state, dispatch } = useContext(EFlightsStateContext);

  return [state, dispatch];
};

export const SET_EFLIGHTS = "SET_EFLIGHTS";
const eFlightsReducer = (state, action) => {
  switch (action.type) {
    case SET_EFLIGHTS:
      return {
        ...state,
        eFlights: action.payload,
      };
    default:
      throw new Error(`Unsupported type of: ${action.type}`);
  }
};

export const setEFlights = (dispatch, newData) => {
  dispatch({ type: SET_EFLIGHTS, payload: newData });
};

export { EFlightsProvider, useEFlights };
