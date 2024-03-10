import styled from "@emotion/styled";
import { getVideo } from "../queries/VideoQuery";
import { useQuery } from "@tanstack/react-query";
import { Video, Comment } from "../assets/interfaces";
import FoldingCube from "../components/FoldingCube";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

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

const PlaylistItem = styled.div`
  cursor: pointer;
  margin: 5px;
`;

const Description = styled.p`
  border: 1px solid black;
  width: 90%;
  margin: 10px;
  padding: 10px;
`;

const CommentsContainer = styled.div`
  width: 90%;
  margin: 10px;
  padding: 10px;
  height: 200px;
  overflow-y: scroll;
  border: 1px solid black;
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
  const user = useAppSelector((state) => state.user.info);
  const playlists = useAppSelector((state) => state.playlists);

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

        <Description>
          {video.snippet.description.substring(0, 200)} ...
        </Description>

        <CommentsContainer>
          {video.comments.map((comment: Comment) => (
            <SingleComment key={comment.id}>
              <img src={comment.snippet.authorProfileImageUrl} />
              <p>{comment.snippet.authorDisplayName}</p>
              <p>{comment.snippet.textDisplay}</p>
            </SingleComment>
          ))}
        </CommentsContainer>

        {/* user will be able to add/remove a video from their playlists */}
        {playlists?.playlistsOverview && (
          <PlaylistsContainer>
            {playlists.playlistsOverview.items.map((playlist) => (
              <PlaylistItem key={playlist.id}>
                <img src={playlist.snippet.thumbnails.default.url} />
              </PlaylistItem>
            ))}
          </PlaylistsContainer>
        )}
      </VideoModalContainer>
    </>
  );
}
