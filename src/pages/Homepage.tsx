import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useGoogleLogin } from "@react-oauth/google";
import { queryPlaylists } from "../queries/PlaylistQuery";
import { queryUserName } from "../queries/UserInfoQuery";
import {
  PlaylistSearchResponse,
  Playlist,
  UserInfo,
} from "../assets/interfaces";

function Playlists({ accessToken }: { accessToken: string | null }) {
  const { isLoading, isError, data, error } = useQuery<PlaylistSearchResponse>({
    queryKey: ["playlists"],
    queryFn: () => queryPlaylists(accessToken!),
    enabled: !!accessToken, // get data only when access token is available
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  if (!data) {
    return <h1>No playlists found.</h1>;
  }

  return (
    <div>
      <h2>Playlists</h2>
      {data.items.map((playlist: Playlist) => (
        <div>
          <h3>{playlist.snippet.title}</h3>
          <p>{playlist.contentDetails.itemCount} videos</p>
          <p>{playlist.snippet.description}</p>
          <img src={playlist.snippet.thumbnails.default.url} alt="thumbnail" />
        </div>
      ))}
    </div>
  );
}

function Homepage() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);

  const login = useGoogleLogin({
    onSuccess: (user) => {
      setToken(user.access_token);
      queryUserName(user.access_token).then((userInfo) => {
        setUser(userInfo);
      });
    },
  });

  return (
    <>
      {token ? (
        <>
          <h1>
            Successfully logged in, Welcome
            {user?.given_name ? ` ${user.given_name}!` : "!"}
          </h1>
          <Playlists accessToken={token} />
        </>
      ) : (
        <button onClick={() => login()}>Login with Google</button>
      )}
    </>
  );
}

export default Homepage;
