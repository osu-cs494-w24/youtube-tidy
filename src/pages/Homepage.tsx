import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { setUser } from "../redux/userSlice";
import { useGoogleLogin } from "@react-oauth/google";
import { queryUserName } from "../queries/UserInfoQuery";
import AllPlaylists from "../components/AllPlaylists";

function Homepage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.info);

  const login = useGoogleLogin({
    onSuccess: (user) => {
      queryUserName(user.access_token).then((userInfo) => {
        // combine access_token into userInfo
        const combinedInfo = { ...userInfo, access_token: user.access_token };
        dispatch(setUser(combinedInfo));
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
          <AllPlaylists accessToken={user.access_token} />
        </>
      ) : (
        <button onClick={() => login()}>Login with Google</button>
      )}
    </>
  );
}

export default Homepage;
