import { UserInfo } from "../assets/interfaces";

const queryUserName = async (accessToken: string) => {
  if (!accessToken) {
    throw new Error("Access token not found.");
  }

  const response = await fetch(
    "https://www.googleapis.com/oauth2/v1/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user information.");
  }

  const userInfo = (await response.json()) as UserInfo;

  return userInfo;
};

export { queryUserName };
