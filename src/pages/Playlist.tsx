import { useParams } from 'react-router-dom'
import { useAppSelector } from "../redux/hooks";
import Playlist from '../components/Playlist';
import PlaylistActionsBar from '../components/PlaylistActionsBar';
import { useEffect, useState } from 'react';

function PlaylistPage() {
  const params = useParams()
  const id = params.id
  const playlists = useAppSelector((state) => state.playlists.playlists);
  const playlist = playlists.find(p => p.id == id)  // TODO: Make an separate selector?


  // TODO: get checked items
  if (playlist) {
    return (
      <>
        <PlaylistActionsBar playlist={playlist} items={null} />
        <Playlist playlist={playlist} />
      </>
    );
  }
  return (
    <p>Error retrieving playlist {id}</p>
  )
}

export default PlaylistPage;
