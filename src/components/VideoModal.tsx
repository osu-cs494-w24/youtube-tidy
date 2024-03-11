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
  cursor: pointer;
`;

const VideoModalContainer = styled.div`
  position: fixed;
  top: 5%;
  left: calc(50vw / 2);
  z-index: 10;
  width: 50%;
  height: 90%;
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

const PlaylistsContainer = styled.div`
  display: flex;
  width: 90%;
  height: fit-content;
  padding: 10px;
  margin: 10px;
  border: 1px solid black;
  overflow-x: scroll; /* add horizontal scrolling */
`;

const Tooltip = styled.span`
  visibility: hidden;
  background-color: black;
  color: white;
  text-align: center;
  border-radius: 6px;
  padding: 3px;
  width: 80%;
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
`;

const PlaylistItem = styled.div`
  position: relative;
  cursor: pointer;
  margin: 5px;

  :hover {
    transform: scale(1.1);
  }

  &:hover ${Tooltip} {
    visibility: visible;
    opacity: 0.9;
  }
`;

const Description = styled.div`
  border: 1px solid black;
  width: 90%;
  margin: 10px;
  padding: 10px;
  cursor: pointer;
`;

const CommentsCollapsedContainer = styled.div`
  width: 90%;
  margin: 10px;
  padding: 10px;
  border: 1px solid black;
  cursor: pointer;
`;

const CommentsContainer = styled.div`
  width: 90%;
  max-height: 200px;
  margin: 10px;
  padding: 10px;
  overflow-y: scroll;
  border: 1px solid black;
  cursor: pointer;
`;

const SingleComment = styled.div`
  border: 1px solid black;
  margin: 5px;
  padding: 5px;
  border-radius: 5px;
`;

// see stack overflow post for the styling of the VideoContainer and
// the VideoFrame in order to maintain aspect ratio of video but scale to container
// https://stackoverflow.com/questions/35814653/automatic-height-when-embedding-a-youtube-video
const VideoContainer = styled.div`
  width: 95%;
  padding-top: calc(56.25% * 0.95); /* 16:9 */
  position: relative;
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
          <CloseButton onClick={onClose}>X</CloseButton>
        </div>
        <VideoContainer>
          <VideoFrame
            src={`https://www.youtube.com/embed/${videoID}`}
            title="YouTube video player"
          />
        </VideoContainer>

        {/* Description and Cmoments are collapsable, only one can be uncollapsed at a time */}
        <Description>
          <h4
            onClick={() => {
              setShowDescription(!showDescription);
              setShowComments(false);
            }}
          >
            Description
          </h4>
          {showDescription && <p>{video.snippet.description}</p>}
        </Description>

        {showComments ? (
          <CommentsContainer>
            <h4 onClick={() => setShowComments(!showComments)}>Comments</h4>
            {video.comments.map((comment: Comment) => (
              <SingleComment key={comment.id}>
                <img src={comment.snippet.authorProfileImageUrl} />
                <p>{comment.snippet.authorDisplayName}</p>
                <p>{comment.snippet.textDisplay}</p>
              </SingleComment>
            ))}
          </CommentsContainer>
        ) : (
          <CommentsCollapsedContainer>
            <h4
              onClick={() => {
                setShowDescription(false);
                setShowComments(!showComments);
              }}
            >
              Comments
            </h4>
          </CommentsCollapsedContainer>
        )}

        {/* Playlists only show up if user is logged in */}
        {playlists?.playlistsOverview && (
          <PlaylistsContainer>
            {playlists.playlistsOverview.items.map((playlist) => (
              <PlaylistItem
                key={playlist.id}
                onClick={() => handlePlaylistClick(playlist.id)}
              >
                <img src={playlist.snippet.thumbnails.default.url} />
                <Tooltip>
                  {videoInPlaylist(playlist.id) ? "Remove from" : "Add to"}
                  {playlist.snippet.title}
                </Tooltip>
              </PlaylistItem>
            ))}
          </PlaylistsContainer>
        )}
      </VideoModalContainer>
    </>
  );
}
