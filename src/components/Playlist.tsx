import styled from "@emotion/styled";
import { MutableRefObject, useRef } from "react";
import { SinglePlaylistObj } from "../assets/interfaces";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  editNameDescriptionPlaylist,
} from "../redux/playlistsSlice";
import {
  renamePlaylistRequest as editNameDescriptionPlaylistRequest,
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

  const editNameRef = useRef() as MutableRefObject<HTMLInputElement>;
  const editDescriptionRef = useRef() as MutableRefObject<HTMLInputElement>;

  const handleEditNameTitlePlaylist = async () => {
    const playlistID = playlist.id
    if (user.info) {
      const updatedPlaylist = await editNameDescriptionPlaylistRequest(
        user.info.access_token,
        playlistID,
        editNameRef.current.value,
        editDescriptionRef.current.value,
      );
      dispatch(editNameDescriptionPlaylist({ playlistID, updatedPlaylist }));
    }
  }

  return (
    <div>
        <PlaylistRenamable type="text" defaultValue={playlist.name} ref={editNameRef} onBlur={handleEditNameTitlePlaylist} />
        <PlaylistRenamable type="text" defaultValue={playlist.description} ref={editDescriptionRef} onBlur={handleEditNameTitlePlaylist} />
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
