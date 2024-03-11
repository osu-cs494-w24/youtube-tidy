import { SinglePlaylistObj } from "../assets/interfaces";

export default function SinglePlaylist({
  playlist,
}: {
  playlist: SinglePlaylistObj;
}) {
  return (
    <div>
      <h2>{playlist.name} Playlist: </h2>
      <p>{playlist.description}</p>
      {playlist.items.map((video, index) => (
        <div key={video.id}>
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
