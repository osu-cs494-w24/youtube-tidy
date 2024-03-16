import { Subscription } from "../assets/interfaces";

const getSubscriptionList = async (accessToken: string) => {
  const BASE_URL =
    "https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet%2CcontentDetails&mine=true&maxResults=50&access_token=";
  const PAGE_TOKEN_PARAM = "&pageToken=";

  if (!accessToken) {
    throw new Error("Access token not found.");
  }

  let subscriptions = [];
  let nextPageToken = "";

  // make the first request
  let response = await fetch(BASE_URL + accessToken);

  if (!response.ok) {
    throw new Error("Failed to fetch playlists.");
  }

  const data = await response.json();
  subscriptions = data.items;

  // As long as there is another page, get the next page and add the subscriptions to the list
  nextPageToken = data.nextPageToken;
  while (nextPageToken) {
    response = await fetch(
      BASE_URL + accessToken + PAGE_TOKEN_PARAM + nextPageToken
    );
    if (!response.ok) {
      throw new Error("Failed to fetch playlists.");
    }
    const pageData = await response.json();
    subscriptions = [...subscriptions, ...pageData.items];
    nextPageToken = pageData.nextPageToken;
  }

  return subscriptions as Subscription[];
};

export { getSubscriptionList };
