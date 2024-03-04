interface Playlist {
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
}

interface PlaylistSearchResponse {
  items: Playlist[];
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

interface YoutubeItem {
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
}

interface YoutubeSearchResponse {
  items: YoutubeItem[];
}

export type {
  YoutubeItem,
  YoutubeSearchResponse,
  Playlist,
  PlaylistSearchResponse,
  UserInfo,
};
