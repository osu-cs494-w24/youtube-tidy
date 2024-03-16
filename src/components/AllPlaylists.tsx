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
    @media (min-width: 1080px) {
      flex-direction: row;
      flex-wrap: wrap;
    }
  `;

  const Cards = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 1rem;
    @media (min-width: 1080px) {
      flex-direction: column;
      margin-right: 1rem;
    }
  `;

  const VideoInfo = styled.div`
    flex-direction: column;
    padding-left: 1rem;
  `;

  const Thumbnail = styled.img`
    display: flex;
    width: 300px;
    height: 225px;
    border-radius: 15px;
  `;

  return (
    <Container>
      {userPlaylists.playlistsOverview?.items.map((playlist) => (
        <Cards key={playlist.id}>
          <Thumbnail
            src={playlist.snippet.thumbnails.default.url}
            alt="thumbnail"
          />
          <VideoInfo>
            <h3>{playlist.snippet.title}</h3>
            {/* Playlist Video Title temporarily disabled. The longer the title, the larger the thumbnail. */}
            <p>{playlist.contentDetails.itemCount} videos</p>
            <p>{playlist.snippet.description}</p>
          </VideoInfo>
        </Cards>
        // </div>
      ))}
    </Container>
  );
}
