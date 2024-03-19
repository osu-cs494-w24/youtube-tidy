import styled from "@emotion/styled";
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
  align-self: center;
  z-index: 10;
  border-radius: 10px;
  background-color: white;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow-y: scroll;
  max-height: 90vh;
  display: flex;
  flex-direction: column;

  @media (max-width: 700px) {
    transform: none;
    width: 90vw;
    top: 5%;
    left: 5%;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  max-width: 100%;
  padding: 1rem;
  text-align: center;
  background-color: red;
  color: white;
  margin: 0;

  h3 {
    max-width: 80%;
  }
`;

const ModalBody = styled.div`
  max-width: 100%;
  overflow-y: scroll;
  scrollbar-width: thin;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  margin: 0;
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
`;

const ContainerModalItems = styled.div`
  display: flex;
  justify-content: center;
`;

const PlaylistItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  max-width: 100%;
  padding: 1rem;
  width: fit-content;
  margin: 1rem;
  flex-grow: 1;
  :hover {
    background-color: #e3e3e3;
    transform: scale(0.99);
  }

  img {
    border-radius: 10px;
    max-height: 100%;
    max-width: 100%;
    margin: 1rem;
  }
  a {
    color: black;
    text-decoration: none;
    :hover {
      text-decoration: underline;
    }
  }
  :hover {
    transform: scale(1.05);
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
        item.contentDetails.videoId
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
  dispatch: ThunkDispatch<any, any, any>,
  setSelectedPlaylistItems: any
) {
  bulkAddToPlaylist(accessToken, items, destPlaylistID, dispatch);
  if (action === "Move") {
    bulkRemoveFromPlaylist(accessToken, items, srcPlaylistID, dispatch);
    setSelectedPlaylistItems([]);
  }
}

export default function MoveCopyPlaylistModal({
  items,
  srcPlaylistID,
  action,
  accessToken,
  hideModal,
  setSelectedPlaylistItems,
}: {
  items: PlaylistItemObj[];
  srcPlaylistID: string;
  action: string;
  accessToken: string | undefined;
  hideModal: () => void;
  setSelectedPlaylistItems: any;
}) {
  const dispatch = useAppDispatch();
  const playlists = useAppSelector((state) => state.playlists);

  if (!playlists) {
    return (
      <>
        <ModalBackdrop />
        <ContainerForModalOverall>
          <h3>No playlists found</h3>
          <CloseButton onClick={hideModal}>X</CloseButton>
        </ContainerForModalOverall>
      </>
    );
  }

  if (!accessToken) {
    return <Login />;
  }
  return (
    <>
      <ModalBackdrop />
      <ContainerForModalOverall>
        <ModalHeader>
          <h3>{action} To...</h3>
          <CloseButton>
            <FontAwesomeIcon icon={faXmark} onClick={hideModal} />
          </CloseButton>
        </ModalHeader>
        <ModalBody>
          {!accessToken ? (
            <Login />
          ) : (
            playlists.playlistsOverview && (
              <div>
                {playlists.playlistsOverview?.items.map((playlist) =>
                  playlist.id !== srcPlaylistID ? (
                    <ContainerModalItems>
                      <PlaylistItem
                        key={playlist.id}
                        onClick={() => {
                          handlePlaylistClick(
                            action,
                            playlist.id,
                            srcPlaylistID,
                            items,
                            accessToken,
                            dispatch,
                            setSelectedPlaylistItems
                          );
                          hideModal();
                        }}
                      >
                        <img src={playlist.snippet.thumbnails.default.url} />
                        <a
                          href={`https://www.youtube.com/playlist?list=${playlist.id}`}
                          target="_blank"
                          rel="nopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {playlist.snippet.title}
                        </a>
                      </PlaylistItem>
                    </ContainerModalItems>
                  ) : null
                )}
              </div>
            )
          )}
        </ModalBody>
      </ContainerForModalOverall>
    </>
  );
}
