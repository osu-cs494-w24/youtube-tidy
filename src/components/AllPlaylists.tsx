import { useAppSelector } from "../redux/hooks";
import { useState, useEffect } from "react";
import styled from "@emotion/styled";

export default function AllPlaylists() {
  const [isDesktop, setIsDesktop] = useState(false);

  // Implementation of dynamic nav bar.
  // Code is dependent upon window.matchMedia function, recommended by this post.
  // See: 'Using JavaScript'.
  // Source: https://stackoverflow.com/questions/50156069/how-can-i-make-my-existing-responsive-navigation-bar-into-a-hamburger-menu-for-s
  // Tablet
  useEffect(() => {
    const screen = window.matchMedia("(min-width: 720px)");
    const handleScreenChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };

    screen.addEventListener("change", handleScreenChange);
    setIsDesktop(screen.matches);

    return () => {
      screen.removeEventListener("change", handleScreenChange);
    };
  }, []);

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
    @media (min-width: 720px) {
      border: 2px solid black;
      flex-direction: row;
      flex-wrap: wrap;
      margin-left: 5rem;
    }
  `;

  const Sidebar = styled.div`
    border: 2px solid black;
    padding: 2rem;
  `;

  const SideBarUL = styled.ul`
    display: flex;
    flex-direction: column;
    padding: 0;
  `;

  const SidebarLi = styled.li`
    list-style-type: none;
  `;

  const Cards = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 1rem;
    @media (min-width: 720px) {
      flex-direction: column;
      margin-right: 1rem;
    }
  `;

  const VideoInfo = styled.div`
    flex-direction: column;
    padding-left: 1rem;
  `;

  const Thumbnail = styled.img`
    @media (min-width: 720px) {
      width: 300px;
      height: 225px;
      border-radius: 15px;
    }
  `;

  return (
    <>
      <Sidebar>
        <SideBarUL>
          Stats
          <SidebarLi>12 playlists</SidebarLi>
          <SidebarLi>504 videos</SidebarLi>
          <SidebarLi>3 subscriptions</SidebarLi>
        </SideBarUL>
        <SideBarUL>Playlists</SideBarUL>
        <SidebarLi>Put data here</SidebarLi>
        <SidebarLi>Put data here</SidebarLi>
        <SidebarLi>Put data here</SidebarLi>
        <SideBarUL>Subscriptions</SideBarUL>
        <SidebarLi>Subscriptions A</SidebarLi>
        <SidebarLi>Subscriptions B</SidebarLi>
        <SidebarLi>Subscriptions C</SidebarLi>
      </Sidebar>
      <Container>
        {userPlaylists.playlistsOverview?.items.map((playlist) => (
          <Cards key={playlist.id}>
            {isDesktop ? (
              <Thumbnail
                src={playlist.snippet.thumbnails.high.url}
                alt="thumbnail"
              />
            ) : (
              <Thumbnail
                src={playlist.snippet.thumbnails.default.url}
                alt="thumbnail"
              />
            )}

            <VideoInfo>
              <h3>{playlist.snippet.title}</h3>
              <p>{playlist.contentDetails.itemCount} videos</p>
              <p>{playlist.snippet.description}</p>
            </VideoInfo>
          </Cards>
          // </div>
        ))}
      </Container>
    </>
  );
}
