import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { UserInfo } from "../assets/interfaces";

interface UserState {
  info: UserInfo | null;
}

const initialState: UserState = {
  info: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserInfo>) {
      state.info = action.payload;
    },
    clearUser(state) {
      state.info = null;
    },
  },
});

export default userSlice.reducer;
export const { setUser, clearUser } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.info;
