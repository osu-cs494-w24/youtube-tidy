import { Video, Comment } from "../assets/interfaces";

/**
 * Fetches a single video from the YouTube API and returns it along with the first 10 comments
 * Video API: https://developers.google.com/youtube/v3/docs/videos/list
 * Comments API: https://developers.google.com/youtube/v3/docs/commentThreads/list
 *
 * @param videoId - (required) the ID of the video to fetch
 */
const getVideo = async (videoId: string) => {
  const YoutubeAPI = import.meta.env.VITE_YOUTUBE_API;

  if (!videoId) {
    throw new Error("No video ID provided.");
  }

  // fetch video data
  const videoResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/videos` +
      `?part=snippet,contentDetails,statistics&id=${videoId}&key=${YoutubeAPI}`
  );

  if (!videoResponse.ok) {
    throw new Error("Failed to fetch video.");
  }

  const videoData = await videoResponse.json();

  // fetch ten comments for the video, sorted by relevance
  const commentResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/commentThreads` +
      `?part=snippet,id,replies&videoId=${videoId}&maxResults=10&order=relevance&textFormat=plainText&key=${YoutubeAPI}`
  );

  if (!commentResponse.ok) {
    return videoData.items[0];
  }

  const commentData = await commentResponse.json();

  // YT API returns comments in a nested structure, this interface is used to keep the
  // mapping of the comments typesafe and a little easier to read
  interface CommentThread {
    snippet: {
      topLevelComment: Comment;
    };
  }

  // the comment info we want is in CommentThread.snippet.topLevelComment
  const comments: Comment[] = commentData.items.map((item: CommentThread) => {
    const { id, snippet } = item.snippet.topLevelComment;
    return {
      id,
      snippet: {
        authorDisplayName: snippet.authorDisplayName,
        authorProfileImageUrl: snippet.authorProfileImageUrl,
        textDisplay: snippet.textDisplay,
        likeCount: snippet.likeCount,
        publishedAt: snippet.publishedAt,
      },
    };
  });

  // video data is returned with a video array, but we only requested one video,
  // so grab the first one and add the comments to it
  const video: Video & { comments: Comment[] } = {
    ...videoData.items[0],
    comments,
  };

  return video;
};

export { getVideo };
