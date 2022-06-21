import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import rootReducer from "redux/reducers";
import { createWrapper } from "next-redux-wrapper";

const middleware: any = [thunk];

if (process.env.NODE_ENV === `development`) {
  const logger = createLogger({
    // ...options
  });

  // middleware.push(logger);
}

const makeStore = () =>
  createStore(rootReducer, composeWithDevTools(applyMiddleware(...middleware)));

const store = createWrapper(makeStore);

export default store;
