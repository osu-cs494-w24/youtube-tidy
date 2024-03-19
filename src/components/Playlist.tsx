import styled from "@emotion/styled";
import { MutableRefObject, useRef } from "react";
import { PlaylistItemObj, SinglePlaylistObj } from "../assets/interfaces";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { editNameDescriptionPlaylist } from "../redux/playlistsSlice";
import { editNameDescriptionPlaylistRequest } from "../requests/PlaylistActions";
import { BigCheckbox } from "./BigCheckbox";

const ControlEditable = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-bottom: 2rem;
  @media (min-width: 587px) {
    justify-content: center;
  }
`;

const PlaylistRenamable = styled.input`
  border: 0px;
  color: red;
  font-size: 1rem;

  &:hover {
    border-color: black;
    border-style: solid;
    /* border-width: 1px; */
    cursor: pointer;
  }
  @media (min-width: 720px) {
    margin-right: 2rem;
    font-size: 2rem;
  }
`;

const PlaylistDescriptionEdit = styled.textarea`
  resize: none;
  border: 0px;
  color: darkslategray;
  &:hover {
    border-color: black;
    border-style: solid;
  }

  @media (min-width: 720px) {
    font-size: 1rem;
  }
`;

const ContainerCards = styled.div`
  display: flex;
  flex-direction: column;
  /* border: 3px solid blue; */
  @media (min-width: 720px) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const Card = styled.div`
  border: 1px solid #e3e3e3;
  margin-bottom: 1rem;
  padding: 1rem;
  box-shadow: 0 0 10px 0 gray;
  border-radius: 15px;
  @media (min-width: 720px) {
    min-width: 40%;
    max-width: 40%;
    margin-right: 2%;
  }
`;

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
    const playlistID = playlist.id;
    if (user.info) {
      const updatedPlaylist = await editNameDescriptionPlaylistRequest(
        user.info.access_token,
        playlistID,
        editNameRef.current.value,
        editDescriptionRef.current.value
      );
      dispatch(editNameDescriptionPlaylist({ playlistID, updatedPlaylist }));
    }
  };

  const handleSelectPlaylistItem = (
    item: PlaylistItemObj,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.checked) {
      setSelectedPlaylistItems([...selectedPlaylistItems, item]);
    } else {
      setSelectedPlaylistItems(
        selectedPlaylistItems.filter((playlistItem) => playlistItem !== item)
      );
    }
  };

  return (
    <div>
      <ControlEditable>
        <PlaylistRenamable
          type="text"
          defaultValue={playlist.name}
          ref={editNameRef}
          onBlur={handleEditNameTitlePlaylist}
        />
        <PlaylistDescriptionEdit
          defaultValue={playlist.description}
          ref={editDescriptionRef}
          onBlur={handleEditNameTitlePlaylist}
          placeholder="Edit Description..."
        />
      </ControlEditable>
      <ContainerCards>
        {playlist.items.map((item, index) => (
          <Card key={item.id}>
            <div>
              <BigCheckbox
                type="checkbox"
                id={item.id}
                onChange={(e) => handleSelectPlaylistItem(item, e)}
              />
              <h3>
                {index + 1}: {item.snippet.title}
              </h3>
              <p>{item.snippet.description.slice(0, 100)}...</p>
              <img src={item.snippet.thumbnails.default.url} alt="thumbnail" />
            </div>
          </Card>
        ))}
      </ContainerCards>
    </div>
  );
}
