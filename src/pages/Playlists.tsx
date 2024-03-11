import { useAppSelector } from "../redux/hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AllPlaylists from "../components/AllPlaylists";
import SinglePlaylist from "../components/SinglePlaylist";

function Playlists() {
  const navigate = useNavigate();
  const playlists = useAppSelector((state) => state.playlists.playlists);
  const user = useAppSelector((state) => state.user.info);

  // redirect to root page if user is not authenticated
  useEffect(() => {
    if (!user?.access_token) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <>
      <h1>
        {user?.given_name ? `${user.given_name}'s Playlists` : "Playlists"}
      </h1>
      <AllPlaylists />
      {playlists.map((playlist) => (
        <SinglePlaylist key={playlist.id} playlist={playlist} />
      ))}
    </>
  );
}

export default Playlists;
