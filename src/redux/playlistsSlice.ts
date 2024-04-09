import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { getAllPlaylists } from "../requests/AllPlaylistsQuery";
import { getPlaylist } from "../requests/SinglePlaylistQuery";
import {
  AllPlaylistSearchResponse,
  PlaylistItemObj,
  PlaylistsObj,
  SinglePlaylistObj,
} from "../assets/interfaces";
import guestPlaylistOverview from "../dummyData/playlistOverview.json";
import guestPlaylists from "../dummyData/playlists.json";

interface LoadPlaylistsResult {
  playlistsOverview: AllPlaylistSearchResponse;
  playlists: SinglePlaylistObj[];
}

export const loadPlaylists = createAsyncThunk<
  LoadPlaylistsResult,
  string | null
>("playlists/loadPlaylists", async (accessToken) => {
  if (!accessToken) {
    throw new Error("Access token not found.");
  }

  if (accessToken === "guest") {
    return new Promise<LoadPlaylistsResult>((resolve) => {
      // build guest playlist from testing data
      let tempPlaylists: SinglePlaylistObj[] = [];
      guestPlaylists.playlists.map((playlist) => {
        const singlePlaylist = {
          name: playlist.name,
          id: playlist.id,
          description: playlist.description,
          nextPageToken: null,
          prevPageToken: null,
          pageInfo: {
            totalResults: playlist.pageInfo.totalResults,
            resultsPerPage: playlist.pageInfo.resultsPerPage,
          },
          items: playlist.items,
        };
        tempPlaylists.push(singlePlaylist);
      });

      resolve({
        playlistsOverview: {
          ...guestPlaylistOverview,
          queryTime: new Date().toISOString(),
        },
        playlists: tempPlaylists,
      });
    });
  }

  const playlistsOverview = await getAllPlaylists(accessToken);
  console.log("playlistsOverview: ", playlistsOverview);
  const playlists = await Promise.all(
    playlistsOverview.items.map(async (playlist) => {
      return await getPlaylist(
        accessToken,
        playlist.id,
        playlist.snippet.title,
        playlist.snippet.description
      );
    })
  );
  return { playlistsOverview, playlists };
});

interface PlaylistsState {
  playlistsOverview: AllPlaylistSearchResponse | null;
  playlists: SinglePlaylistObj[];
  loading: "idle" | "pending" | "fulfilled" | "error";
  error: string | null;
}

const initialState: PlaylistsState = {
  playlistsOverview: null,
  playlists: [],
  loading: "idle",
  error: null,
};

const playlistsSlice = createSlice({
  name: "playlists",
  initialState,
  reducers: {
    addPlaylistsOverview(
      state,
      action: PayloadAction<AllPlaylistSearchResponse>
    ) {
      state.playlistsOverview = action.payload;
    },
    addPlaylist(state, action: PayloadAction<SinglePlaylistObj>) {
      state.playlists.push(action.payload);
    },
    addVideoToPlaylist(
      state,
      action: PayloadAction<{
        playlistID: string;
        playlistItem: PlaylistItemObj;
      }>
    ) {
      const { playlistID, playlistItem } = action.payload;

      // find the playlist and confirm the video isn't already in it
      const playlist = state.playlists.find(
        (playlist) => playlist.id === playlistID
      );
      if (playlist) {
        const videoExists = playlist.items.find(
          (video) => video.id === playlistItem.id
        );

        if (!videoExists) {
          playlist.items.push(playlistItem);

          // update itemCount in the playlist overview
          const playlistOverviewItem = state.playlistsOverview?.items.find(
            (playlist) => playlist.id === playlistID
          );
          if (playlistOverviewItem) {
            playlistOverviewItem.contentDetails.itemCount++;
            playlistOverviewItem.snippet.thumbnails.default =
              playlist.items[0].snippet.thumbnails.default;
            playlistOverviewItem.snippet.thumbnails.high =
              playlist.items[0].snippet.thumbnails.high;
          }
        }
      }
    },
    removeVideoFromPlaylist(
      state,
      action: PayloadAction<{ playlistID: string; videoID: string }>
    ) {
      const { playlistID, videoID } = action.payload;
      const playlist = state.playlists.find(
        (playlist) => playlist.id === playlistID
      );
      if (playlist) {
        playlist.items = playlist.items.filter(
          (video) => video.contentDetails.videoId !== videoID
        );

        // update itemCount in the playlist overview
        const playlistOverviewItem = state.playlistsOverview?.items.find(
          (playlist) => playlist.id === playlistID
        );
        if (playlistOverviewItem) {
          playlistOverviewItem.contentDetails.itemCount--;
          playlistOverviewItem.snippet.thumbnails.default = playlist.items
            .length
            ? playlist.items[0].snippet.thumbnails.default
            : { url: "https://i.ytimg.com/img/no_thumbnail.jpg" };
          playlistOverviewItem.snippet.thumbnails.high = playlist.items.length
            ? playlist.items[0].snippet.thumbnails.high
            : { url: "https://i.ytimg.com/img/no_thumbnail.jpg" };
        }
      }
    },
    editNameDescriptionPlaylist(
      state,
      action: PayloadAction<{
        playlistID: string;
        updatedPlaylist: PlaylistsObj;
      }>
    ) {
      const { playlistID, updatedPlaylist } = action.payload;
      const playlist = state.playlists.find(
        (playlist) => playlist.id === playlistID
      );
      const playlistsOverviewItem = state.playlistsOverview
        ? state.playlistsOverview.items.find(
            (playlist) => playlist.id === playlistID
          )
        : null;
      if (playlist && playlistsOverviewItem) {
        playlist.name = updatedPlaylist.snippet.title;
        playlist.description = updatedPlaylist.snippet.description;
        playlistsOverviewItem.snippet.title = updatedPlaylist.snippet.title;
        playlistsOverviewItem.snippet.description =
          updatedPlaylist.snippet.description;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadPlaylists.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(loadPlaylists.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.playlistsOverview = action.payload.playlistsOverview;
        state.playlists = action.payload.playlists;
        state.error = null;
      })
      .addCase(loadPlaylists.rejected, (state, action) => {
        state.loading = "error";
        state.error = action.error.message || "Unknown error";
      });
  },
});

export default playlistsSlice.reducer;
export const selectPlaylists = (state: RootState) => state.playlists;
export const {
  addPlaylistsOverview,
  addPlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  editNameDescriptionPlaylist,
} = playlistsSlice.actions;
