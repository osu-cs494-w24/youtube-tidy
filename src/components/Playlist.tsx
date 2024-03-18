import styled from "@emotion/styled";
import { MutableRefObject, useRef } from "react";
import { PlaylistItemObj, SinglePlaylistObj } from "../assets/interfaces";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  editNameDescriptionPlaylist,
} from "../redux/playlistsSlice";
import {
  editNameDescriptionPlaylistRequest,
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

const PlaylistDescriptionEdit = styled.textarea`
  border: 0px;
  color: darkslategray;
  &:hover {
    border-color: black;
    border-style: solid;
    border-width: 1px;
  }
`


export default function Playlist({
  playlist,
  selectedPlaylistItems,
  setSelectedPlaylistItems,
}: {
  playlist: SinglePlaylistObj;
  selectedPlaylistItems: PlaylistItemObj[];
  setSelectedPlaylistItems: any;
}) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  const editNameRef = useRef() as MutableRefObject<HTMLInputElement>;
  const editDescriptionRef = useRef() as MutableRefObject<HTMLTextAreaElement>;

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

  const handleSelectPlaylistItem = (
    item: PlaylistItemObj,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.checked) {
      setSelectedPlaylistItems([...selectedPlaylistItems, item]);
    }
    else {
      setSelectedPlaylistItems(selectedPlaylistItems.filter(
        (playlistItem) => playlistItem !== item
      ))
    }
  };

  return (
    <div>
      <PlaylistRenamable type="text" defaultValue={playlist.name} ref={editNameRef} onBlur={handleEditNameTitlePlaylist} />
      <PlaylistDescriptionEdit defaultValue={playlist.description} ref={editDescriptionRef} onBlur={handleEditNameTitlePlaylist} />
      {playlist.items.map((item, index) => (
        <div key={item.id}>
          <input type="checkbox" id={item.id} onChange={(e) => handleSelectPlaylistItem(item, e)} />
          <h3>
            {index + 1}: {item.snippet.title}
          </h3>
          <p>{item.snippet.description.slice(0, 100)}...</p>
          <img src={item.snippet.thumbnails.default.url} alt="thumbnail" />
        </div>
      ))}
    </div>
  );
}
