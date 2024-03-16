import { Subscription } from "../assets/interfaces";

/**
 * Fetches a list of subscriptions for a user using their access token.
 *
 * @param {string} accessToken - The user's access token.
 * @returns {Promise<Subscription[]>} A promise that resolves to an array of Subscription objects.
 * @throws {Error} If the access token is not provided or if the fetch request fails.
 */
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
    throw new Error("Failed to fetch subscriptions.");
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
      throw new Error("Failed to fetch subscriptions.");
    }
    const pageData = await response.json();
    subscriptions = [...subscriptions, ...pageData.items];
    nextPageToken = pageData.nextPageToken;
  }

  return subscriptions as Subscription[];
};

/**
 * Removes channels from a user's subscriptions using their access token and a list of subscription IDs.
 *
 * @param {string} accessToken - The user's access token.
 * @param {string[]} subscriptionIdList - An array of subscription IDs to be removed.
 * @returns {Promise<boolean>} A promise that resolves to true if the channels are successfully removed.
 * @throws {Error} If the access token or subscription ID list is not provided, or if the fetch request fails.
 */
const removeChannelsFromSubscriptions = async (
  accessToken: string,
  subscriptionIdList: string[]
) => {
  if (!accessToken || !subscriptionIdList) {
    throw new Error("Access token or subscription list not found.");
  }

  const YoutubeKey = import.meta.env.VITE_YOUTUBE_API;

  const requestOptions = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  // iterate over a list of subscription ids and make requests to the youtube API
  for (const subscriptionId of subscriptionIdList) {
    const url = `https://www.googleapis.com/youtube/v3/subscriptions?id=${subscriptionId}&key=${YoutubeKey}`;
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error("Failed to channel from subscriptions.");
    }
  }
  // on a successful delete, return true
  return true;
};

export { getSubscriptionList, removeChannelsFromSubscriptions };
