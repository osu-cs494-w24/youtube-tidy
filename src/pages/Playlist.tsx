import { useParams } from 'react-router-dom'
import { useAppSelector } from "../redux/hooks";
import SinglePlaylist from "../components/SinglePlaylist";

function Playlist() {
  const params = useParams()
  const id = params.id
  const playlists = useAppSelector((state) => state.playlists.playlists);
  const playlist = playlists.find(p => p.id == id)

  if (playlist) {
    return (
      <>
        <SinglePlaylist playlist={playlist} />
      </>
    );
  }
  return (
    <p>Error retrieving playlist {id}</p>
  )
}

export default Playlist;
