import { useParams } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import Playlist from "../components/Playlist";
import PlaylistActionsBar from "../components/PlaylistActionsBar";
import { SetStateAction, useState } from "react";
import { PlaylistItemObj } from "../assets/interfaces";

import styled from "@emotion/styled";

const Container = styled.div`
  /* border: 2px solid green; */
`;

function PlaylistPage() {
  const params = useParams();
  const id = params.id;
  const playlists = useAppSelector((state) => state.playlists.playlists);
  const playlist = playlists.find((p) => p.id == id); // TODO: Make a separate selector?

  const [selectedPlaylistItems, setSelectedPlaylistItems] = useState<
    Map<PlaylistItemObj, boolean>
  >(new Map());
  if (playlist) {
    playlist.items.map((item) => selectedPlaylistItems.set(item, false));
    return (
      <>
        <PlaylistActionsBar
          playlist={playlist}
          selectedPlaylistItems={selectedPlaylistItems}
          setSelectedPlaylistItems={(
            selectedPlaylistItems: SetStateAction<Map<PlaylistItemObj, boolean>>
          ) => setSelectedPlaylistItems(selectedPlaylistItems.entries())}
        />
        <Container>
          <Playlist
            playlist={playlist}
            selectedPlaylistItems={selectedPlaylistItems}
            setSelectedPlaylistItems={(
              selectedPlaylistItems: SetStateAction<
                Map<PlaylistItemObj, boolean> | undefined
              >
            ) => setSelectedPlaylistItems(selectedPlaylistItems)}
          />
        </Container>
      </>
    );
  }
  return <p>Loading with ID...: {id}</p>;
}

export default PlaylistPage;
