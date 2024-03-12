import { SinglePlaylistObj } from "../assets/interfaces";

/*
 * This function is used to get all videos from a single playlist,
 * utilizing YouTube's playlistItems endpoint https://developers.google.com/youtube/v3/docs/playlistItems
 * This endpoint does not return the playlist ID, name, or description, so we need to pass those in as arguments
 * if we want them to be included in the playlist object that will be put in the store
 *
 * @param accessToken - (required) the user's access token
 * @param playlistId - (required) the ID of the playlist to get videos from
 * @param playlistName - the name of the playlist
 * @param playlistDesc - the description of the playlist
 */
const getPlaylist = async (
  accessToken: string,
  playlistId: string,
  playlistName: string | null,
  playlistDesc: string | null
) => {
  if (!accessToken || !playlistId) {
    throw new Error("Missing access token or playlist ID.");
  }

  let nextPageToken = "";
  let videos: SinglePlaylistObj["items"] = [];
  let data = {} as SinglePlaylistObj;

  // use pagination to get all videos in the playlist
  do {
    const response = await fetch(
      "https://www.googleapis.com/youtube/v3/playlistItems" +
        `?part=snippet,id,contentDetails&playlistId=${playlistId}` +
        `&access_token=${accessToken}&pageToken=${nextPageToken}&maxResults=50`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch playlists.");
    }

    data = (await response.json()) as SinglePlaylistObj;

    nextPageToken = data.nextPageToken || "";

    videos = videos.concat(data.items);
  } while (nextPageToken);

  // create the playlist object from the data response and videos arrray
  const playlist: SinglePlaylistObj = {
    name: playlistName!,
    id: playlistId,
    description: playlistDesc!,
    nextPageToken: null,
    prevPageToken: data.prevPageToken!,
    pageInfo: {
      totalResults: data.pageInfo.totalResults,
      resultsPerPage: data.pageInfo.resultsPerPage,
    },
    items: videos.map((video) => ({
      id: video.id,
      snippet: {
        title: video.snippet.title,
        description: video.snippet.description,
        publishedAt: video.snippet.publishedAt,
        thumbnails: {
          default: {
            url: video.snippet.thumbnails.default?.url,
          },
          medium: {
            url: video.snippet.thumbnails.medium?.url,
          },
          high: {
            url: video.snippet.thumbnails.high?.url,
          },
          standard: {
            url: video.snippet.thumbnails.standard?.url,
          },
          maxres: {
            url: video.snippet.thumbnails.maxres?.url,
          },
        },
      },
      contentDetails: {
        videoId: video.contentDetails.videoId,
        videoPublishedAt: video.contentDetails.videoPublishedAt,
      },
    })),
  };

  return playlist;
};

export { getPlaylist };
