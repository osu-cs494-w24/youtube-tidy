import { useState } from "react";
import { PlaylistItemObj, SinglePlaylistObj } from "../assets/interfaces";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { removeVideoFromPlaylist } from "../redux/playlistsSlice";
import { removeVideoFromPlaylistRequest } from "../requests/PlaylistActions";
import MoveCopyPlaylistModal from "./MoveCopyPlaylistModal";
import { ThunkDispatch } from "@reduxjs/toolkit";
import styled from "@emotion/styled";

const MOVE = "Move";
const COPY = "Copy";
const REMOVE = "Remove";

const ContainerButtons = styled.div`
  display: flex;
  justify-content: center;
`;

const Bottons = styled.button`
  margin-bottom: 1rem;
  &:hover:enabled {
    box-shadow: 10px 5px 5px rgba(252, 210, 211, 0.5);
  }
  &:hover:disabled {
    cursor: not-allowed;
  }
`;

export async function bulkRemoveFromPlaylist(
  accessToken: string | undefined,
  items: PlaylistItemObj[] | null,
  playlistID: string,
  dispatch: ThunkDispatch<any, any, any>
) {
  if (!items || !accessToken) {
    return;
  }
  // Running these in parallel causes a 409 error, so calls are in sequence instead: https://stackoverflow.com/a/37576787
  for (const item of items) {
    const removeVideo = await removeVideoFromPlaylistRequest(
      accessToken,
      item.id
    );
    if (!removeVideo) {
      dispatch(
        removeVideoFromPlaylist({
          playlistID,
          videoID: item.contentDetails.videoId,
        })
      );
    }
  }
}

export default function PlaylistActionsBar({
  playlist,
  selectedPlaylistItems,
  setSelectedPlaylistItems,
}: {
  playlist: SinglePlaylistObj;
  selectedPlaylistItems: Map<PlaylistItemObj, boolean> | undefined;
  setSelectedPlaylistItems: any;
}) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const accessToken = user.info?.access_token;
  const items = selectedPlaylistItems?.keys()
    ? [...selectedPlaylistItems.keys()]
    : null;
  const [showDestModal, setShowDestModal] = useState(false);
  const [currentAction, setCurrentAction] = useState(REMOVE);
  return (
    <>
      <ContainerButtons>
        <Bottons
          type="submit"
          onClick={() => {
            setCurrentAction(MOVE);
            setShowDestModal(true);
          }}
          disabled={!accessToken || !selectedPlaylistItems}
        >
          Move to...
        </Bottons>
        <Bottons
          type="submit"
          onClick={() => {
            setCurrentAction(COPY);
            setShowDestModal(true);
          }}
          disabled={!accessToken || !selectedPlaylistItems}
        >
          Copy to...
        </Bottons>
        <Bottons
          type="submit"
          onClick={() => {
            setCurrentAction(REMOVE);
            bulkRemoveFromPlaylist(accessToken, items, playlist.id, dispatch);
            setSelectedPlaylistItems([]);
          }}
          disabled={!accessToken || !selectedPlaylistItems}
        >
          Remove
        </Bottons>
      </ContainerButtons>
      {showDestModal ? (
        <MoveCopyPlaylistModal
          items={items}
          srcPlaylistID={playlist.id}
          action={currentAction}
          hideModal={() => setShowDestModal(false)}
          accessToken={accessToken}
          setSelectedPlaylistItems={setSelectedPlaylistItems}
        />
      ) : null}
    </>
  );
}
