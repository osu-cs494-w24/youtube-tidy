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
  // Timeout used to test loading state
  // await new Promise((resolve) => setTimeout(resolve, 2000));

  if (import.meta.env.VITE_USE_DUMMY_DATA === "true") {
    const response = await fetch("/dummyData/subscriptions.json");
    const dummySubscriptions = await response.json();
    return dummySubscriptions.items;
  }

  const subscriptionList = await getSubscriptionList(accessToken);

  return subscriptionList;
});

interface SubscriptionsState {
  subscriptionList: Subscription[];
  status: "idle" | "pending" | "fulfilled" | "error";
  error: string | null;
}

const initialState: SubscriptionsState = {
  subscriptionList: [],
  status: "idle",
  error: null,
};

const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState: initialState,
  reducers: {
    // Remove a list of subscriptions from the store
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
        state.status = "pending";
      })
      .addCase(loadSubscriptions.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.subscriptionList = action.payload;
        state.error = null;
      })
      .addCase(loadSubscriptions.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message || "Unknown error";
      });
  },
});

export default subscriptionsSlice.reducer;
export const { removeSubscriptions } = subscriptionsSlice.actions;
export const selectNumSubscriptions = (state: RootState) =>
  state.subscriptions.subscriptionList.length;
