const YoutubeKey = import.meta.env.VITE_YOUTUBE_API;

/*
 *  Sends a post request to add a video to a playlist, on success, returns a YT PlaylistItem object
 *  Reference: https://developers.google.com/youtube/v3/docs/playlistItems/insert
 *
 * @param accessToken - (required) the user's access token
 * @param playlistID - (required) the ID of the playlist to add the video to
 * @param videoID - (required) the ID of the video to add to the playlist
 */
const addVideoToPlaylistRequest = async (
  accessToken: string,
  playlistID: string,
  videoID: string
) => {
  if (!accessToken || !playlistID || !videoID) {
    throw new Error("Access token or playlist ID not found.");
  }

  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&key=${YoutubeKey}`;

  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      snippet: {
        playlistId: playlistID,
        resourceId: {
          kind: "youtube#video",
          videoId: videoID,
        },
      },
    }),
  };

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    throw new Error("Failed to add video to playlist.");
  }

  return response.json();
};

/*
 *  Sends a delete request to remove a video from a playlist
 *  Reference: https://developers.google.com/youtube/v3/docs/playlistItems/delete
 *
 * @param accessToken - (required) the user's access token
 * @param playlistItemID - (required) the ID of the playlist item to remove (note that
 *   this is not the same as the video ID, it's the 'playlistItemID')
 */
const removeVideoFromPlaylistRequest = async (
  accessToken: string,
  playlistItemID: string
) => {
  if (!accessToken || !playlistItemID) {
    throw new Error("Access token or playlist ID not found.");
  }

  const url = `https://www.googleapis.com/youtube/v3/playlistItems?id=${playlistItemID}&key=${YoutubeKey}`;

  const requestOptions = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    throw new Error("Failed to remove video from playlist.");
  }

  // on a sucessful delete, the response will be empty
  return null;
};

export { addVideoToPlaylistRequest, removeVideoFromPlaylistRequest };
