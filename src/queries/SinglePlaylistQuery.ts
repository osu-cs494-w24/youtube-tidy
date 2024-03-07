import { SinglePlaylistObj } from "../assets/interfaces";

const getPlaylist = async (
  accessToken: string,
  playlistId: string,
  playlistName: string | null,
  playlistDesc: string | null
) => {
  if (!accessToken) {
    throw new Error("Access token not found.");
  }

  // only 5 videos are fetched as default, we can add '&maxResults=50' but will need to implement
  // pagination to get more. There is a nextPageToken in the response to get the next page of results
  const response = await fetch(
    "https://www.googleapis.com/youtube/v3/playlistItems" +
      `?part=snippet,id,contentDetails&playlistId=${playlistId}&access_token=${accessToken}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch playlists.");
  }

  const data = (await response.json()) as SinglePlaylistObj;

  console.log("playlist: ", data);

  const playlist: SinglePlaylistObj = {
    name: playlistName!,
    id: playlistId,
    description: playlistDesc!,
    nextPageToken: data.nextPageToken,
    prevPageToken: data.prevPageToken,
    pageInfo: {
      totalResults: data.pageInfo.totalResults,
      resultsPerPage: data.pageInfo.resultsPerPage,
    },
    items: data.items.map((video) => ({
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
