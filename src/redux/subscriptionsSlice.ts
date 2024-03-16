import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { getSubscriptionList } from "../requests/SubscriptionActions";
import { Subscription } from "../assets/interfaces";

export const loadSubscriptions = createAsyncThunk<
  Subscription[],
  string | null
>("subscriptions/loadSubscriptions", async (accessToken) => {
  if (!accessToken) {
    throw new Error("Access token not found.");
  }
  if (import.meta.env.VITE_USE_DUMMY_DATA === "true") {
    const response = await fetch("/subscriptions.json");
    const dummySubscriptions = await response.json();
    return dummySubscriptions.items;
  }

  const subscriptionList = await getSubscriptionList(accessToken);

  return subscriptionList;
});

// subscription state
interface SubscriptionsState {
  subscriptionList: Subscription[];
  loading: "idle" | "pending" | "fulfilled" | "error";
  error: string | null;
}

// initial state
const initialState: SubscriptionsState = {
  subscriptionList: [],
  loading: "idle",
  error: null,
};

// create slice
const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState: initialState,
  reducers: {
    removeSubscriptions(state, action) {
      const subscriptionsToDelete = action.payload;
      state.subscriptionList = state.subscriptionList.filter(
        (subscription) => !subscriptionsToDelete.includes(subscription.id)
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSubscriptions.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(loadSubscriptions.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.subscriptionList = action.payload;
        state.error = null;
      })
      .addCase(loadSubscriptions.rejected, (state, action) => {
        state.loading = "error";
        state.error = action.error.message || "Unknown error";
      });
  },
});

// reducer, which can be passed to the slice
export default subscriptionsSlice.reducer;
export const { removeSubscriptions } = subscriptionsSlice.actions;
export const selectNumSubscriptions = (state: RootState) =>
  state.subscriptions.subscriptionList.length;
