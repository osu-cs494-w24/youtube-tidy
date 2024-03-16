import { useParams } from 'react-router-dom'
import { useAppSelector } from "../redux/hooks";
import Playlist from '../components/Playlist';
import PlaylistActionsBar from '../components/PlaylistActionsBar';

function PlaylistPage() {
  const params = useParams()
  const id = params.id
  const playlists = useAppSelector((state) => state.playlists.playlists);
  const playlist = playlists.find(p => p.id == id)  // TODO: Make an separate selector?

  if (playlist) {
    return (
      <>
        <PlaylistActionsBar />
        <Playlist playlist={playlist} />
      </>
    );
  }
  return (
    <p>Error retrieving playlist {id}</p>
  )
}

export default PlaylistPage;
