import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { setUser } from "../redux/userSlice";
import { useGoogleLogin } from "@react-oauth/google";
import { queryUserName } from "../requests/UserInfoQuery";
import AllPlaylists from "../components/AllPlaylists";
import { loadPlaylists } from "../redux/playlistsSlice";
import SinglePlaylist from "../components/SinglePlaylist";

function Homepage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.info);
  const playlists = useAppSelector((state) => state.playlists.playlists);

  const login = useGoogleLogin({
    scope: [
      "openid",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/youtube.force-ssl",
    ].join(" "),
    onSuccess: (user) => {
      console.log("user scope: ", user.scope);
      queryUserName(user.access_token).then((userInfo) => {
        // combine access_token into userInfo
        const combinedInfo = { ...userInfo, access_token: user.access_token };
        dispatch(setUser(combinedInfo));
        dispatch(loadPlaylists(user.access_token));
      });
    },
  });

  return (
    <>
      {user?.access_token ? (
        <>
          <h1>
            Successfully logged in, Welcome
            {user?.given_name ? ` ${user.given_name}!` : "!"}
          </h1>
          <AllPlaylists />
          {playlists && playlists.length > 0 ? (
            <div>
              <h2>Playlist Details:</h2>
              {playlists.map((playlist) => (
                <SinglePlaylist key={playlist.id} playlist={playlist} />
              ))}
            </div>
          ) : (
            <div>No playlists found</div>
          )}
        </>
      ) : (
        <button onClick={() => login()}>Login with Google</button>
      )}
    </>
  );
}

export default Homepage;
