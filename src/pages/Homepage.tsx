import { useAppSelector } from "../redux/hooks";
import AllPlaylists from "../components/AllPlaylists";
import SinglePlaylist from "../components/SinglePlaylist";
import styled from "@emotion/styled";

function Homepage() {
  const user = useAppSelector((state) => state.user.info);
  // const playlists = useAppSelector((state) => state.playlists.playlists);

  return (
    <>
      {/* <h1>Homepage</h1> */}
      {user?.access_token ? (
        <>
          <AllPlaylists />: (<div>No playlists found</div>)
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
