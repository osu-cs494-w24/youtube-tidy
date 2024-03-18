import { useAppSelector } from "../redux/hooks";
import { useState, useEffect } from "react";
import AllPlaylists from "../components/AllPlaylists";
import Subscriptions from "./Subscriptions";
import SinglePlaylist from "../components/SinglePlaylist";
import styled from "@emotion/styled";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

const YoutubeAPI = import.meta.env.VITE_YOUTUBE_API;

function Homepage() {
  const [isDesktop, setIsDesktop] = useState(false);
  const user = useAppSelector((state) => state.user.info);
  const playlists = useAppSelector((state) => state.playlists.playlists);
  const totalPlaylistCount = playlists.length;
  const subscriptionList = useAppSelector((state) => state.subscriptions);
  const [trendingObj, setTrendingObj] = useState([]);

  const maxCharsForTitle = 40;

  const ThumbsUp = styled.div`
    color: red;
    font-size: 1.4rem;
  `;

  useEffect(() => {
    const trendingVideo = async () => {
      const trendingRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?key=${YoutubeAPI}&part=contentDetails,statistics,snippet&chart=mostPopular&regionCode=US&maxResults=5`
      );
      const trendingData = await trendingRes.json();
      setTrendingObj(trendingData.items.map((object) => object));
    };
    trendingVideo();
  }, []);

  const ContainerTrending = styled.div`
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 10px 0 gray;
    border-radius: 15px;
    margin-bottom: 1rem;
    justify-content: center;
    overflow-x: scroll;
    @media (min-width: 1080px) {
      flex-direction: row;
    }
  `;

  const TrendingMedia = styled.h4`
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
  `;

  const CardTrending = styled.div`
    padding: 1rem;
    display: flex;
    flex-direction: column;
    h4 {
      max-width: 65%;
    }
    @media (min-width: 1080px) {
      padding-right: 1rem;
    }
  `;

  const ControlIFrame = styled.iframe`
    display: flex;
    max-width: 100%;
  `;

  const totalVids = playlists
    .map((object) => object.pageInfo.totalResults)
    .reduce((acc, curr) => acc + curr, 0);

  const ContainerShowAll = styled.div`
    display: flex;
    flex-direction: column;
  `;

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

  const [playlistToggle, setPlaylistToggle] = useState(true);
  const [subscriptionsToggle, setSubscriptionsToggle] = useState(false);

  const ContainerButtons = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
  `;

  const HomepageButton = styled.button`
    margin-top: 1rem;
    margin-bottom: 1rem;
    flex-grow: 1;
    :hover {
      box-shadow: 10px 5px 5px rgba(252, 210, 211, 0.5);
    }
  `;

  const ContainerDesktop = styled.div`
    @media (min-width: 720px) {
      display: flex;
    }
  `;

  const Sidebar = styled.div`
    box-shadow: 0 0 10px 0 gray;
    border-radius: 15px;
    padding: 2rem;
    margin-bottom: 1rem;
  `;

  const SideBarUL = styled.ul`
    display: flex;
    flex-direction: column;
    padding: 0;
  `;

  const SideBarSpan = styled.span`
    font-weight: 600;
    color: red;
  `;

  const SidebarLi = styled.li`
    list-style-type: none;
    margin-bottom: 0.4rem;
    font-weight: 500;
  `;

  return (
    <>
      {user?.access_token && (
        <>
          <h1>Homepage</h1>
          <ContainerTrending>
            {trendingObj &&
              trendingObj.map((video) => (
                <CardTrending key={video.id}>
                  <ControlIFrame
                    src={`https://www.youtube.com/embed/${video.id}`}
                  />
                  <TrendingMedia>
                    {video.snippet.title.slice(0, maxCharsForTitle) + "..."}
                  </TrendingMedia>
                  <TrendingMedia>
                    <ThumbsUp>
                      <FontAwesomeIcon icon={faThumbsUp} />:{" "}
                      {video.statistics.likeCount}
                    </ThumbsUp>
                  </TrendingMedia>
                </CardTrending>
              ))}
          </ContainerTrending>
          <ContainerDesktop>
            {isDesktop ? (
              <Sidebar>
                <SideBarUL>
                  <SideBarSpan>Stats</SideBarSpan>
                  <SidebarLi>{totalPlaylistCount} playlists</SidebarLi>
                  <SidebarLi>{totalVids} videos</SidebarLi>
                </SideBarUL>
                <SideBarUL>
                  <SideBarSpan>Playlists</SideBarSpan>
                </SideBarUL>

                {playlists.map((object) => (
                  <SidebarLi>{object.name}</SidebarLi>
                ))}
                <SideBarUL>
                  <SideBarSpan>Subscriptions</SideBarSpan>
                </SideBarUL>
                {subscriptionList.subscriptionList.map((object) => (
                  <SidebarLi>{object.snippet.title}</SidebarLi>
                ))}
              </Sidebar>
            ) : null}
            {window.innerWidth < 720 ? (
              <ContainerButtons>
                <HomepageButton
                  onClick={() => {
                    setPlaylistToggle(true);
                    setSubscriptionsToggle(false);
                  }}
                >
                  Playlists
                </HomepageButton>

                <HomepageButton
                  onClick={() => {
                    setSubscriptionsToggle(true);
                    setPlaylistToggle(false);
                  }}
                >
                  Subscriptions
                </HomepageButton>
              </ContainerButtons>
            ) : null}

            <ContainerShowAll>
              {window.innerWidth < 720 ? (
                playlists && !subscriptionsToggle && <AllPlaylists />
              ) : (
                <AllPlaylists />
              )}
              {window.innerWidth < 720
                ? subscriptionsToggle && !playlistToggle && <Subscriptions />
                : null}
            </ContainerShowAll>
          </ContainerDesktop>
        </>
      )}
    </>
  );
}

export default Homepage;
