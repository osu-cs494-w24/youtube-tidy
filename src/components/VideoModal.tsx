import styled from "@emotion/styled";
import { useState } from "react";
import { getVideo } from "../requests/VideoQuery";
import { useQuery } from "@tanstack/react-query";
import { Video, Comment, SinglePlaylistObj } from "../assets/interfaces";
import FoldingCube from "../components/FoldingCube";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  addVideoToPlaylist,
  removeVideoFromPlaylist,
} from "../redux/playlistsSlice";
import {
  addVideoToPlaylistRequest,
  removeVideoFromPlaylistRequest,
} from "../requests/PlaylistActions";
import Login from "./Login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faXmark,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 15;
  background-color: red;
  color: white;
  border: none;
  padding: 0.5rem;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 10px;
  border-top-left-radius: 0;
  border-bottom-right-radius: 0;
  cursor: pointer;

  :hover {
    transform: scale(1.1);
  }
`;

const VideoModalContainer = styled.div`
  position: fixed;
  top: 5%;
  left: calc(50vw / 2);
  z-index: 10;
  width: 50%;
  max-height: 90%;
  height: fit-content;
  border-radius: 10px;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
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

const PlaylistToolTip = styled.span`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  font-size: 0.75rem;
  background-color: rgb(161, 161, 161);
  box-shadow: 0 0 10px 0 black;
  color: white;
  border-radius: 6px;
  padding: 3px;
  max-width: 80%;
  position: absolute;
  top: 10%;
  left: 10%;
  opacity: 0;
  transition: opacity 0.3s;

  p {
    margin: 0;
    padding-left: 5px;
    width: fit-content;
    text-align: center;
  }
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
    width: 100%:
  }
  :hover {
    transform: scale(1.1);
  }

  &:hover ${PlaylistToolTip} {
    visibility: visible;
    opacity: 0.9;
  }
`;

const CollapsableContainer = styled.div`
  border: 1px solid #e3e3e3;
  border-radius: 10px;
  width: 90%;
  margin: 10px;
  padding: 10px;
  cursor: pointer;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);

  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px;
    align-items: center;
  }

  h4 {
    margin: 0;
  }

  .body {
    border-top: 1px solid gray;
    padding: 10px;
    cursor: default;
  }

  .comments {
    max-height: 300px;
    overflow-y: scroll;
    scrollbar-width: thin;
  }

  .playlists {
    display: flex;
    height: fit-content;
    padding: 10px;
    margin: 10px;
    overflow-x: scroll; /* add horizontal scrolling */
    scrollbar-width: thin;
  }
`;

const SingleComment = styled.div`
  border: 1px solid #e3e3e3;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  padding: 10px;
  padding-bottom: 0px;
  margin-bottom: 10px;
  border-radius: 10px;

  .comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid gray;
    padding: 5px;
  }

  .user-info {
    display: flex;
  }

  img {
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
`;

// see stack overflow post for the styling of the VideoContainer and
// the VideoFrame in order to maintain aspect ratio of video but scale to container
// https://stackoverflow.com/questions/35814653/automatic-height-when-embedding-a-youtube-video
const VideoContainer = styled.div`
  width: 95%;
  padding-top: calc(56.25% * 0.95); /* 16:9 */
  position: relative;
  margin: 10px;
  border-radius: 10px;
  overflow: hidden;
`;

const VideoFrame = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export default function VideoModal({
  videoID,
  onClose,
}: {
  videoID: string;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const playlists = useAppSelector((state) => state.playlists);
  const [showDescription, setShowDescription] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showPlaylists, setShowPlaylists] = useState(true);

  // check if current video is in a given playlist, returns the video if it is
  // in the form of a playlistItem, which is nested in the SinglePlaylistObj interface
  const videoInPlaylist = (playlistID: string) => {
    const playlist = playlists.playlists?.find(
      (playlist: SinglePlaylistObj) => playlist.id === playlistID
    );
    if (playlist) {
      const videoInPlaylist = playlist.items.find(
        (video) => video.contentDetails.videoId === videoID
      );
      return videoInPlaylist;
    }
  };

  // retrieve video data from the API
  const { isLoading, data: video } = useQuery<Video>({
    queryKey: ["video", videoID],
    queryFn: () => getVideo(videoID),
  });

  if (isLoading) {
    return (
      <>
        <VideoModalBackdrop />
        <VideoModalContainer>
          <FoldingCube />
        </VideoModalContainer>
      </>
    );
  }

  if (!video) {
    return (
      <>
        <VideoModalBackdrop />
        <VideoModalContainer>
          <h3>Failed to load video</h3>
          <CloseButton onClick={onClose}>X</CloseButton>
        </VideoModalContainer>
      </>
    );
  }

  // either add or remove a video from a playlist
  const handlePlaylistClick = async (playlistID: string) => {
    const isInPlaylist = videoInPlaylist(playlistID);

    // add the video to the playlist if it's not already in it
    if (!isInPlaylist && user.info) {
      const playlistItem = await addVideoToPlaylistRequest(
        user.info.access_token,
        playlistID,
        videoID
      );
      dispatch(addVideoToPlaylist({ playlistID, playlistItem }));
    }

    // otherwise remove the video from the playlist
    else if (user.info) {
      const playlistItemID = isInPlaylist?.id;
      if (playlistItemID) {
        await removeVideoFromPlaylistRequest(
          user.info.access_token,
          playlistItemID
        );
        dispatch(removeVideoFromPlaylist({ playlistID, videoID }));
      }
    }
  };

  return (
    <>
      <VideoModalBackdrop />
      <VideoModalContainer>
        <div className="modal-header">
          <h3>{video.snippet.title}</h3>
          <CloseButton onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </CloseButton>
        </div>
        <VideoContainer>
          <VideoFrame
            src={`https://www.youtube.com/embed/${videoID}`}
            title="YouTube video player"
          />
        </VideoContainer>

        {/* Playlists only show up if user is logged in */}
        <CollapsableContainer id="playlists">
          <div
            className="header"
            onClick={() => setShowPlaylists(!showPlaylists)}
          >
            <h4>Playlists</h4>
            {!user.info ? (
              <Login />
            ) : showPlaylists ? (
              <FontAwesomeIcon icon={faChevronUp} />
            ) : (
              <FontAwesomeIcon icon={faChevronDown} />
            )}
          </div>
          {playlists?.playlistsOverview && showPlaylists && (
            <div className="body playlists">
              {playlists.playlistsOverview.items.map((playlist) => (
                <PlaylistItem
                  key={playlist.id}
                  onClick={() => handlePlaylistClick(playlist.id)}
                >
                  <img src={playlist.snippet.thumbnails.default.url} />
                  <PlaylistToolTip>
                    {videoInPlaylist(playlist.id) ? (
                      <FontAwesomeIcon icon={faMinus} />
                    ) : (
                      <FontAwesomeIcon icon={faPlus} />
                    )}
                    <p>{playlist.snippet.title}</p>
                  </PlaylistToolTip>
                </PlaylistItem>
              ))}
            </div>
          )}
        </CollapsableContainer>

        {/* Description and Comments are collapsable, only one can be uncollapsed at a time */}
        <CollapsableContainer id="description">
          <div
            className="header"
            onClick={() => {
              setShowDescription(!showDescription);
              setShowComments(false);
            }}
          >
            <h4>Description</h4>
            {showDescription ? (
              <FontAwesomeIcon icon={faChevronUp} />
            ) : (
              <FontAwesomeIcon icon={faChevronDown} />
            )}
          </div>
          {showDescription && (
            <div className="body">{video.snippet.description}</div>
          )}
        </CollapsableContainer>

        <CollapsableContainer id="comments">
          <div
            className="header"
            onClick={() => {
              setShowComments(!showComments);
              setShowDescription(false);
            }}
          >
            <h4>Comments Preview</h4>
            {showComments ? (
              <FontAwesomeIcon icon={faChevronUp} />
            ) : (
              <FontAwesomeIcon icon={faChevronDown} />
            )}
          </div>
          {showComments && (
            <div className="body comments">
              {video.comments.map((comment: Comment) => (
                <SingleComment key={comment.id}>
                  <div className="comment-header">
                    <div className="user-info">
                      <img src={comment.snippet.authorProfileImageUrl} />
                      <p>{comment.snippet.authorDisplayName}</p>
                    </div>
                    <p>
                      {new Date(
                        comment.snippet.publishedAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <p>{comment.snippet.textDisplay}</p>
                </SingleComment>
              ))}
            </div>
          )}
        </CollapsableContainer>
      </VideoModalContainer>
    </>
  );
}
