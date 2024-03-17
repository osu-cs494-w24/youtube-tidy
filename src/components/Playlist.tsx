import styled from "@emotion/styled";
import { MutableRefObject, useRef } from "react";
import { SinglePlaylistObj } from "../assets/interfaces";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  renamePlaylist,
} from "../redux/playlistsSlice";
import {
  renamePlaylistRequest,
} from "../requests/PlaylistActions";

const PlaylistRenamable = styled.input`
  border: 0px;
  color: red;
  &:hover {
    border-color: black;
    border-style: solid;
    border-width: 1px;
  }
`;


export default function Playlist({
  playlist,
}: {
  playlist: SinglePlaylistObj;
}) {

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  const renameInputRef = useRef() as MutableRefObject<HTMLInputElement>;

  const handleRenamePlaylist = async () => {
    console.log(renameInputRef ? renameInputRef.current.value : "")
    const playlistID = playlist.id
    if (user.info) {
      const updatedPlaylist = await renamePlaylistRequest(
        user.info.access_token,
        playlistID,
        renameInputRef.current.value,
      );
      dispatch(renamePlaylist({ playlistID, updatedPlaylist }));
    }
  }

  return (
    <div>
        <PlaylistRenamable type="text" defaultValue={playlist.name} ref={renameInputRef} onBlur={handleRenamePlaylist} />
      <p>{playlist.description}</p>
      {playlist.items.map((video, index) => (
        <div key={video.id}>
          <input type="checkbox" id={video.id} />
          <h3>
            {index + 1}: {video.snippet.title}
          </h3>
          <p>{video.snippet.description.slice(0, 100)}</p>
          <img src={video.snippet.thumbnails.default.url} alt="thumbnail" />
        </div>
      ))}
    </div>
  );
}
