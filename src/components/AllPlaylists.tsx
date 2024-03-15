import { useAppSelector } from "../redux/hooks";
import styled from "@emotion/styled";

export default function AllPlaylists() {
  const userPlaylists = useAppSelector((state) => state.playlists);
  const status = useAppSelector((state) => state.playlists.loading);

  if (status === "pending") return <div>Loading...</div>;
  if (status === "error") return <div>Error with retrieving playlists</div>;
  if (userPlaylists.playlistsOverview?.items.length === 0) {
    return <h1>You don't have any playlists</h1>;
  }

  const Container = styled.div`
    display: flex;
    flex-direction: column;
  `;

  const Cards = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 1rem;
  `;

  const VideoInfo = styled.div`
    flex-direction: column;
    padding-left: 1rem;
  `;

  return (
    <Container>
      {/* <h2>Playlists Overview</h2> */}
      {userPlaylists.playlistsOverview?.items.map((playlist) => (
        // <div key={playlist.id}>
        <Cards key={playlist.id}>
          <img src={playlist.snippet.thumbnails.default.url} alt="thumbnail" />
          <VideoInfo>
            <h3>{playlist.snippet.title}</h3>
            <p>{playlist.contentDetails.itemCount} videos</p>
            <p>{playlist.snippet.description}</p>
          </VideoInfo>
        </Cards>
        // </div>
      ))}
    </Container>
  );
}
