import { useAppSelector } from "../redux/hooks";
import SinglePlaylist from "../components/SinglePlaylist";

function Playlist() {
  const playlists = useAppSelector((state) => state.playlists.playlists);
  const playlist = playlists.find(p => p.id == 'test')

  if (playlist) {
    return (
      <>
        <SinglePlaylist playlist={playlist} />
      </>
    );
  }
  return (
    <p>Error retrieving playlist {'test'}</p>
  )
}

export default Playlist;
