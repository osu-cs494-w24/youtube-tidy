import { PlaylistItemsResponse } from "../assets/interfaces";

const queryPlaylistItems = async (accessToken: string) => {
  if (!accessToken) {
    throw new Error("Access token not found.");
  }

  const response = await fetch(
    "https://www.googleapis.com/youtube/v3/playlistItems" +
      `?part=snippet&mine=true&access_token=${accessToken}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch playlist items.");
  }

  const playlistItems = (await response.json()) as PlaylistItemsResponse;

  return playlistItems;
};

export { queryPlaylistItems };
