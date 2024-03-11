import { AllPlaylistSearchResponse } from "../assets/interfaces";

/*
 * Fetches all playlists for the authenticated user from the YouTube API,
 * but does not return info on the videos in each playlist. This is used
 * as a "playlist overview" in the store
 * Reference: https://developers.google.com/youtube/v3/docs/playlists/list
 *
 * @param accessToken - (required) the access token for the user
 */
const getAllPlaylists = async (accessToken: string) => {
  if (!accessToken) {
    throw new Error("Access token not found.");
  }

  // We can only get playlists the user made, if they've saved a playlist that someone else made, it won't be returned.
  // If user has more than 50 playlists we'll need to implement pagination
  const response = await fetch(
    "https://www.googleapis.com/youtube/v3/playlists" +
      `?part=snippet,id,contentDetails&mine=true&maxResults=50&access_token=${accessToken}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch playlists.");
  }

  const playlists = (await response.json()) as AllPlaylistSearchResponse;

  return playlists;
};

export { getAllPlaylists };
