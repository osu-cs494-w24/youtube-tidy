import { useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { queryUserName } from "../requests/UserInfoQuery";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setUser } from "../redux/userSlice";
import { loadPlaylists } from "../redux/playlistsSlice";
import { loadSubscriptions } from "../redux/subscriptionsSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import Cookies from "js-cookie";

import styled from "@emotion/styled";

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const LoginModal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 40%;
  margin: 10% 30%;
  box-shadow: 0px 0px 10px gray;
  border-radius: 15px;
  text-align: center;

  @media (max-width: 655px) {
    width: 90%;
    margin: 0;
  }
`;

const LoginButton = styled.button`
  :hover {
    box-shadow: 10px 5px 5px rgba(252, 210, 211, 0.5);
  }
  margin: 1rem;
  width: fit-content;

  @media (min-width: 587px) {
    margin-top: 0;
  }
`;

function Login() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.info);

  useEffect(() => {
    const access_token = Cookies.get("access_token");
    if (access_token) {
      handleUserInfo(access_token);
    }
  }, [dispatch]);

  const handleUserInfo = (access_token: string) => {
    queryUserName(access_token).then((userInfo) => {
      // combine access_token into userInfo
      const combinedInfo = { ...userInfo, access_token };
      dispatch(setUser(combinedInfo));
      // load playlists into store
      dispatch(loadPlaylists(access_token));
      // load subscriptions into store
      dispatch(loadSubscriptions(combinedInfo.access_token));
    });
  };

  const login = useGoogleLogin({
    scope: [
      "openid",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/youtube.force-ssl",
    ].join(" "),
    onSuccess: (user) => {
      handleUserInfo(user.access_token);
      Cookies.set("access_token", user.access_token, { expires: 1 });
    },
  });

  return (
    <>
      {!user?.access_token && (
        <LoginContainer>
          <LoginModal>
            <h3>Welcome to Youtube Tidy!</h3>
            <p>
              This web application was built with React, the YouTube Data API,
              and some other helpful libraries. Login with your Google/YouTube
              account, and use YouTube Tidy to quickly move vidoes between
              playlists, mass delete or add videos to playlists, and more!
            </p>
            <LoginButton onClick={() => login()}>
              Login with <FontAwesomeIcon icon={faGoogle} />
            </LoginButton>
          </LoginModal>
        </LoginContainer>
      )}
    </>
  );
}

export default Login;
