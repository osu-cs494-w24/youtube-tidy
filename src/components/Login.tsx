import { useGoogleLogin } from "@react-oauth/google";
import { queryUserName } from "../requests/UserInfoQuery";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setUser } from "../redux/userSlice";
import { loadPlaylists } from "../redux/playlistsSlice";

function Login() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.info);

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
        </>
      ) : (
        <button onClick={() => login()}>Login with Google</button>
      )}
    </>
  );
}

export default Login;
