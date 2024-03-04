import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import searchReducer from "./searchSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    search: searchReducer,
  },
});

store.subscribe(() => {
  console.log("store: ", store.getState());
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
