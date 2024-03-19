import styled from "@emotion/styled";
import { useState } from "react";
import FoldingCube from "../components/FoldingCube";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addVideoToPlaylist } from "../redux/playlistsSlice";
import { addVideoToPlaylistRequest } from "../requests/PlaylistActions";
import Login from "./Login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { PlaylistItemObj } from "../assets/interfaces";
import { bulkRemoveFromPlaylist } from "./PlaylistActionsBar";
import { ThunkDispatch } from "@reduxjs/toolkit";

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 15;
  background-color: transparent;
  color: white;
  border: none;
  padding: 0.5rem;
  border-top-left-radius: 0;
  border-bottom-right-radius: 0;
  cursor: pointer;

  :hover {
    transform: scale(1.1);
  }
`;

const ContainerForModalOverall = styled.div`
  display: flex;
  flex-direction: column;
`;

const VideoModalContainer = styled.div`
  align-self: center;
  z-index: 10;
  border-radius: 10px;
  background-color: white;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;

  @media (max-width: 700px) {
    transform: none;
    width: 90vw;
    top: 5%;
    left: 5%;
  }

  .modal-header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    text-align: center;
    background-color: red;
    color: white;

    h3 {
      max-width: 80%;
    }
  }

  .modal-body {
    width: 100%;
    overflow-y: scroll;
    scrollbar-width: thin;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
`;

const VideoModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
`;

const PlaylistItem = styled.div`
  position: relative;
  cursor: pointer;
  margin-right: 15px;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);

  img {
    border-radius: 10px;
    height: 100%;
    width: 100%;
  }
  :hover {
    transform: scale(1.1);
  }
`;

export async function bulkAddToPlaylist(
  accessToken: string | undefined,
  items: PlaylistItemObj[],
  destPlaylistID: string,
  dispatch: ThunkDispatch<any, any, any>
) {
  if (!accessToken) {
  } else {
    // Running these in parallel causes a 409 error, so calls are in sequence instead: https://stackoverflow.com/a/37576787
    for (const item of items) {
      const insertVideo = await addVideoToPlaylistRequest(
        accessToken,
        destPlaylistID,
        item.id
      );
      dispatch(
        addVideoToPlaylist({
          playlistID: destPlaylistID,
          playlistItem: insertVideo,
        })
      );
    }
  }
}

function handlePlaylistClick(
  action: string,
  destPlaylistID: string,
  srcPlaylistID: string,
  items: PlaylistItemObj[],
  accessToken: string,
  dispatch: ThunkDispatch<any, any, any>
) {
  bulkAddToPlaylist(accessToken, items, destPlaylistID, dispatch);
  if (action === "Move") {
    bulkRemoveFromPlaylist(accessToken, items, srcPlaylistID, dispatch);
  }
}

export default function MoveCopyPlaylistModal({
  items,
  srcPlaylistID,
  action,
  accessToken,
  hideModal,
}: {
  items: PlaylistItemObj[];
  srcPlaylistID: string;
  action: string;
  accessToken: string | undefined;
  hideModal: () => void;
}) {
  const dispatch = useAppDispatch();
  const playlists = useAppSelector((state) => state.playlists);

  if (!playlists) {
    return (
      <>
        <VideoModalBackdrop />
        <ContainerForModalOverall>
          <VideoModalContainer>
            <h3>No playlists found</h3>
            <CloseButton onClick={hideModal}>X</CloseButton>
          </VideoModalContainer>
        </ContainerForModalOverall>
      </>
    );
  }

  if (!accessToken) {
    return <Login />;
  }
  return (
    <>
      <VideoModalBackdrop />
      <ContainerForModalOverall>
        <VideoModalContainer>
          <div className="modal-header">
            <h3>{action} To...</h3>
            <CloseButton>
              <FontAwesomeIcon icon={faXmark} onClick={hideModal} />
            </CloseButton>
          </div>
          <div className="modal-body">
            {!accessToken ? (
              <Login />
            ) : (
              playlists.playlistsOverview && (
                <div className="body playlists">
                  {playlists.playlistsOverview.items.map((playlist) =>
                    playlist.id !== srcPlaylistID ? (
                      <PlaylistItem
                        key={playlist.id}
                        onClick={() => {
                          handlePlaylistClick(
                            action,
                            playlist.id,
                            srcPlaylistID,
                            items,
                            accessToken,
                            dispatch
                          );
                          hideModal();
                        }}
                      >
                        <img src={playlist.snippet.thumbnails.default.url} />
                      </PlaylistItem>
                    ) : null
                  )}
                </div>
              )
            )}
          </div>
        </VideoModalContainer>
      </ContainerForModalOverall>
    </>
  );
}
