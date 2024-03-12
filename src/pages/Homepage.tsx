import { useAppSelector } from "../redux/hooks";
import AllPlaylists from "../components/AllPlaylists";
import SinglePlaylist from "../components/SinglePlaylist";

import Login from "../components/Login";

function Homepage() {
  const user = useAppSelector((state) => state.user.info);
  const playlists = useAppSelector((state) => state.playlists.playlists);

  return (
    <>
      <Login />
      <h1>Homepage</h1>
      {user?.access_token ? (
        <>
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
      ) : null}
    </>
  );
}

export default Homepage;
