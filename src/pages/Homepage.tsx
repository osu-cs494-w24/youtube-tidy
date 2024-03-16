import { useAppSelector } from "../redux/hooks";
import { useState } from "react";
import AllPlaylists from "../components/AllPlaylists";
import SinglePlaylist from "../components/SinglePlaylist";
import styled from "@emotion/styled";

function Homepage() {
  const user = useAppSelector((state) => state.user.info);
  // const playlists = useAppSelector((state) => state.playlists.playlists);

  const [playlistToggle, setPlaylistToggle] = useState(true);
  const [subscriptionsToggle, setSubscriptionsToggle] = useState(false);

  const ContainerButtons = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
  `;

  const HomepageButton = styled.button`
    margin-top: 1rem;
    margin-bottom: 1rem;
    flex-grow: 1;
    :hover {
      box-shadow: 10px 5px 5px rgba(252, 210, 211, 0.5);
    }
  `;

  const ContainerDesktop = styled.div`
    @media (min-width: 720px) {
      display: flex;
    }
  `;

  return (
    <>
      {/* <h1>Homepage</h1> */}
      {user?.access_token ? (
        <>
          <ContainerDesktop>
            {window.innerWidth < 720 ? (
              <ContainerButtons>
                <HomepageButton
                  onClick={() => {
                    setPlaylistToggle(true);
                    setSubscriptionsToggle(false);
                  }}
                >
                  Playlists
                </HomepageButton>

                <HomepageButton
                  onClick={() => {
                    setSubscriptionsToggle(true);
                    setPlaylistToggle(false);
                  }}
                >
                  Subscriptions
                </HomepageButton>
              </ContainerButtons>
            ) : null}

            {playlistToggle && !subscriptionsToggle && <AllPlaylists />}
            {subscriptionsToggle && !playlistToggle && (
              <p>Place `AllSubscriptions` component here</p>
            )}
          </ContainerDesktop>
        </>
      ) : (
        <>
          <p>
            {" "}
            ! This is a temporary page for non-logged in users, plan on showing
            generic playlists, subs, videos, etc !{" "}
          </p>
          <p>
            Welcome to Tube Tidy! This web application was built with React, the
            YouTube Data API, Google Cloud Console, and other related libraries.
          </p>
          <p>
            Login with your Google/YouTube account, and explore your playlists,
            subscriptions, and search for videos. You can even edit your
            playlists and subscriptions.
          </p>
          <p>
            ! This is a temporary page for non-logged in users, plan on showing
            generic playlists, subs, videos, etc !
          </p>
        </>
      )}
    </>
  );
}

export default Homepage;
