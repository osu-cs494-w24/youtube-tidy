import { Video } from "../assets/interfaces";

// takes an access token and an array of video ids and returns an array of videos
const getVideos = async (accessToken: string, videoIds: string[]) => {
  if (!accessToken) {
    throw new Error("Access token not found.");
  }

  if (videoIds.length === 0) {
    throw new Error("No video ids provided.");
  }

  const videoIdsString = videoIds.join(",");

  // Max videos that can be returned in one get is 50
  const response = await fetch(
    "https://www.googleapis.com/youtube/v3/videos" +
      `?part=snippet,id,contentDetails,fileDetails,suggestions&id=${videoIdsString}&access_token=${accessToken}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch video(s).");
  }

  const data = await response.json();

  console.log("data: ", data);

  const videos: Video[] = data.items.map((item: Video) => {
    return {
      id: item.id,
      snippet: item.snippet,
      contentDetails: item.contentDetails,
      statistics: item.statistics,
    };
  });

  return videos;
};

export { getVideos };
