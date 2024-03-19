import { useState } from "react";
import { PlaylistItemObj, SinglePlaylistObj } from "../assets/interfaces";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { removeVideoFromPlaylist } from "../redux/playlistsSlice";
import { removeVideoFromPlaylistRequest } from "../requests/PlaylistActions";
import MoveCopyPlaylistModal from "./MoveCopyPlaylistModal";
import { ThunkDispatch } from "@reduxjs/toolkit";

const MOVE = "Move";
const COPY = "Copy";
const REMOVE = "Remove";

export async function bulkRemoveFromPlaylist(
  accessToken: string | undefined,
  items: PlaylistItemObj[],
  playlistID: string,
  dispatch: ThunkDispatch<any, any, any>
) {
  if (accessToken) {
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
}

export default function PlaylistActionsBar({
  playlist,
  items,
}: {
  playlist: SinglePlaylistObj;
  items: PlaylistItemObj[];
}) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const accessToken = user.info?.access_token;
  const [showDestModal, setShowDestModal] = useState(false);
  const [currentAction, setCurrentAction] = useState(REMOVE);
  return (
    <>
      <button
        type="submit"
        onClick={() => {
          setCurrentAction(MOVE);
          setShowDestModal(true);
        }}
        disabled={!accessToken}
      >
        Move to...
      </button>
      <button
        type="submit"
        onClick={() => {
          setCurrentAction(COPY);
          setShowDestModal(true);
        }}
        disabled={!accessToken}
      >
        Copy to...
      </button>
      <button
        type="submit"
        onClick={() => {
          setCurrentAction(REMOVE);
          bulkRemoveFromPlaylist(accessToken, items, playlist.id, dispatch);
        }}
        disabled={!accessToken}
      >
        Remove
      </button>
      {showDestModal ? (
        <MoveCopyPlaylistModal
          items={items}
          srcPlaylistID={playlist.id}
          action={currentAction}
          hideModal={() => setShowDestModal(false)}
          accessToken={accessToken}
        />
      ) : null}
    </>
  );
}
