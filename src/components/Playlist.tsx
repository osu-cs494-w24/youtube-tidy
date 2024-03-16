import styled from "@emotion/styled";
import { MutableRefObject, useRef } from "react";
import { SinglePlaylistObj } from "../assets/interfaces";


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

  const renameInputRef = useRef() as MutableRefObject<HTMLInputElement>

  function renamePlaylist() {
    console.log(renameInputRef ? renameInputRef.current.value : "")
    // TODO: send request to rename playlist
  }

  return (
    <div>
        <PlaylistRenamable type="text" defaultValue={playlist.name} ref={renameInputRef} onBlur={renamePlaylist} />
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
