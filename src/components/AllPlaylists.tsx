import { useAppSelector } from "../redux/hooks";

export default function AllPlaylists() {
  const userPlaylists = useAppSelector((state) => state.playlists);
  const status = useAppSelector((state) => state.playlists.loading);

  if (status === "pending") return <div>Loading...</div>;
  if (status === "error") return <div>Error with retrieving playlists</div>;
  if (userPlaylists.playlistsOverview?.items.length === 0) {
    return <h1>You don't have any playlists</h1>;
  }

  return (
    <div>
      <h2>Playlists Overview</h2>
      {userPlaylists.playlistsOverview?.items.map((playlist) => (
        <div key={playlist.id}>
          <h3>{playlist.snippet.title}</h3>
          <p>{playlist.contentDetails.itemCount} videos</p>
          <p>{playlist.snippet.description}</p>
          <img src={playlist.snippet.thumbnails.default.url} alt="thumbnail" />
        </div>
      ))}
    </div>
  );
}
