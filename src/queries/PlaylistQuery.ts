import { PlaylistSearchResponse } from "../assets/interfaces";

const queryPlaylists = async (accessToken: string) => {
  if (!accessToken) {
    throw new Error("Access token not found.");
  }

  // We can only get playlists the user made, if they've saved a playlist that someone else made, it won't be returned
  // default number of results is 5, max is 50, use '&maxResults=50' to get 50 results, if user has more than
  //    50 we'll need to implement paging, more info on api doc: https://developers.google.com/youtube/v3/docs/playlists/list
  const response = await fetch(
    "https://www.googleapis.com/youtube/v3/playlists" +
      `?part=snippet,id,contentDetails&mine=true&access_token=${accessToken}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch playlists.");
  }

  const playlists = (await response.json()) as PlaylistSearchResponse;

  return playlists;
};

export { queryPlaylists };
