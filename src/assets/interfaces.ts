// this represents all playlists a user has from /playlists endpoint
interface AllPlaylistSearchResponse {
  queryTime: string;
  items: {
    id: string;
    snippet: {
      title: string;
      description: string;
      publishedAt: string;
      thumbnails: {
        default: {
          url: string;
        };
      };
    };
    contentDetails: {
      itemCount: number;
    };
  }[];
}

// This represents a single subscription item
interface Subscription {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    title: string;
    description: string;
    resourceId: {
      kind: string;
      channelId: string;
    };
    channelId: string;
    thumbnails: {
      default: {
        url: string;
      };
      medium: {
        url: string;
      };
      high: {
        url: string;
      };
    };
  };
  contentDetails: {
    totalItemCount: number;
    newItemCount: number;
    activityType: string;
  };
}

// this represents a single playlist from /playlistItems endpoint
interface SinglePlaylistObj {
  name: string;
  id: string;
  description: string;
  nextPageToken: string | null;
  prevPageToken: string | null;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  //each item represents a video in the playlist
  items: {
    id: string;
    snippet: {
      title: string;
      description: string;
      publishedAt: string;
      thumbnails: {
        default: {
          url: string;
        };
        medium: {
          url: string;
        };
        high: {
          url: string;
        };
        standard: {
          url: string;
        };
        maxres: {
          url: string;
        };
      };
    };
    contentDetails: {
      videoId: string;
      videoPublishedAt: string;
    };
  }[];
}

interface UserInfo {
  id: string;
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
  access_token: string;
}

// a single video from /videos endpoint
interface Video {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    channelId: string;
    channelTitle: string;
    thumbnails: {
      default: {
        url: string;
      };
      medium: {
        url: string;
      };
      high: {
        url: string;
      };
      standard: {
        url: string;
      };
      maxres: {
        url: string;
      };
    };
  };
  contentDetails: {
    duration: string;
    caption: string;
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    dislikeCount: string;
    favoriteCount: string;
    commentCount: string;
  };
  comments: Comment[];
}

// comments on a video are retrieved from /comments endpoint
interface Comment {
  id: string;
  snippet: {
    authorDisplayName: string;
    authorProfileImageUrl: string;
    textDisplay: string;
    likeCount: number;
    publishedAt: string;
  };
}

// a single query from /search endpoint
interface YoutubeSearchResponse {
  query: string;
  queryTime: string;
  nextPageToken: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  // each item represents a video
  items: {
    id: {
      videoId: string;
    };
    snippet: {
      title: string;
      description: string;
      thumbnails: {
        high: {
          url: string;
        };
      };
    };
  }[];
}

export type {
  YoutubeSearchResponse,
  AllPlaylistSearchResponse,
  UserInfo,
  SinglePlaylistObj,
  Subscription,
  Video,
  Comment,
};
