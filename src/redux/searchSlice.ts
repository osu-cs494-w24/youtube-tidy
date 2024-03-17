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
      // get search results that match query
      const search = state.searchResults.find(
        (result) => result.query === action.payload.query
      );

      if (search) {
        for (const item of action.payload.items) {
          search.items.push(item);
        }
        search.nextPageToken = action.payload.nextPageToken;
      }
    },
  },
});

export default searchSlice.reducer;
export const { addSearchResults, addPaginated } = searchSlice.actions;
export const selectSearch = (state: RootState) => state.search.searchResults;
