import { useParams } from 'react-router-dom'
import { useAppSelector } from "../redux/hooks";
import Playlist from '../components/Playlist';
import PlaylistActionsBar from '../components/PlaylistActionsBar';
import { SetStateAction, useState } from 'react';
import { PlaylistItemObj } from '../assets/interfaces';

function PlaylistPage() {
  const params = useParams()
  const id = params.id
  const playlists = useAppSelector((state) => state.playlists.playlists);
  const playlist = playlists.find(p => p.id == id)  // TODO: Make an separate selector?

  const [ selectedPlaylistItems, setSelectedPlaylistItems ] = useState<PlaylistItemObj[]>([]);

  if (playlist) {
    return (
      <>
        <PlaylistActionsBar playlist={playlist} items={selectedPlaylistItems} />
        <Playlist playlist={playlist} selectedPlaylistItems={selectedPlaylistItems} setSelectedPlaylistItems={(selectedPlaylistItems: SetStateAction<PlaylistItemObj[]>) => setSelectedPlaylistItems(selectedPlaylistItems)} />
      </>
    );
  }
  return (
    <p>Error retrieving playlist {id}</p>
  )
}

export default PlaylistPage;
