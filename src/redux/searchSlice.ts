import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { YoutubeSearchResponse } from "../assets/interfaces";

interface SearchState {
  searchResults: YoutubeSearchResponse[];
}

const initialState: SearchState = {
  searchResults: [],
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    addSearchResults(state, action: PayloadAction<YoutubeSearchResponse>) {
      let search = state.searchResults.find(
        (result) => result.query === action.payload.query
      );

      //if search already exists, update it, otherwise add it to list
      if (search) {
        search = action.payload;
      } else {
        state.searchResults.push(action.payload);
      }
    },
    addPaginated(state, action: PayloadAction<YoutubeSearchResponse>) {
      console.log("Did I reach here? Let's see...: ", action.payload);
      state.searchResults.push(action.payload);
      console.log("Check store...");
    },
  },
});

export default searchSlice.reducer;
export const { addSearchResults, addPaginated } = searchSlice.actions;
export const selectSearch = (state: RootState) => state.search.searchResults;
