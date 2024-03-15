import { useGoogleLogin } from "@react-oauth/google";
import { queryUserName } from "../requests/UserInfoQuery";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setUser } from "../redux/userSlice";
import { loadPlaylists } from "../redux/playlistsSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

import styled from "@emotion/styled";

const ContainerButton = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StylePFP = styled.img`
  max-width: 85px;
  max-height: 85px;
  border-radius: 50px;
  align-self: flex-end;
  :hover {
    box-shadow: 10px 5px 5px rgba(252, 210, 211, 0.5);
  }
`;

const LoginButton = styled.button`
  :hover {
    box-shadow: 10px 5px 5px rgba(252, 210, 211, 0.5);
  }
  margin-top: 1rem;
  margin-bottom: 1rem;
  @media (min-width: 587px) {
    margin-top: 0;
  }
`;

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
          {user.picture && user.picture ? (
            <StylePFP src={user.picture} />
          ) : (
            <StylePFP src="src/assets/unnamed.jpg" />
          )}
        </>
      ) : (
        <>
          <ContainerButton>
            <LoginButton onClick={() => login()}>
              Login with <FontAwesomeIcon icon={faGoogle} />
            </LoginButton>
          </ContainerButton>
        </>
      )}
    </>
  );
}

export default Login;
