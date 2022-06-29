import { configureStore } from "node_modules/@reduxjs/toolkit";
import mainReducer from "redux/reducers/mainReducer";

const store = configureStore({
  reducer: {
    // Define a top-level state field named `todos`, handled by `todosReducer`
    main: mainReducer,
  },
});

export default store;
