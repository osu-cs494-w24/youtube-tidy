import { useQuery } from "@tanstack/react-query";
import { queryPlaylists } from "../queries/PlaylistQuery";
import { PlaylistSearchResponse, Playlist } from "../assets/interfaces";

export default function AllPlaylists({
  accessToken,
}: {
  accessToken: string | null;
}) {
  const { isLoading, isError, data, error } = useQuery<PlaylistSearchResponse>({
    queryKey: ["playlists"],
    queryFn: () => queryPlaylists(accessToken!),
    enabled: !!accessToken, // get data only when access token is available
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  if (!data) {
    return <h1>No playlists found.</h1>;
  }

  return (
    <div>
      <h2>Playlists</h2>
      {data.items.map((playlist: Playlist) => (
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
