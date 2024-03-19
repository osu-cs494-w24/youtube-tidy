import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { addSearchResults, addPaginated } from "../redux/searchSlice";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import FoldingCube from "../components/FoldingCube";
import styled from "@emotion/styled";
import { YoutubeSearchResponse, SinglePlaylistObj } from "../assets/interfaces";
import VideoModal from "../components/VideoModal";
import { addVideoToPlaylist } from "../redux/playlistsSlice";
import { addVideoToPlaylistRequest } from "../requests/PlaylistActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const StyledInput = styled.input`
  font-size: 2rem;
  border-radius: 7px;
`;

import dData from "../dummyData/SearchResults.json";
const dummyData = {
  ...dData,
  query: "cute cats",
  queryTime: new Date().toISOString(),
};

// playlist container styling
const PlaylistToolTip = styled.span`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  font-size: 0.75rem;
  background-color: rgb(161, 161, 161);
  box-shadow: 0 0 10px 0 black;
  color: white;
  border-radius: 6px;
  padding: 3px;
  max-width: 80%;
  position: absolute;
  top: 10%;
  left: 10%;
  opacity: 0;
  transition: opacity 0.3s;

  p {
    margin: 0;
    padding-left: 5px;
    width: fit-content;
    text-align: center;
  }
`;

const PlaylistItem = styled.div`
  position: relative;
  cursor: pointer;
  margin-right: 15px;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);

  img {
    border-radius: 10px;
    height: 100%;
  }

  :hover {
    transform: scale(1.1);
  }

  &:hover ${PlaylistToolTip} {
    visibility: visible;
    opacity: 0.9;
  }
`;

const PlaylistsContainer = styled.div`
  border: 1px solid #e3e3e3;
  border-radius: 10px;
  width: 90%;
  margin: 10px;
  padding: 10px;
  cursor: pointer;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  /* display: flex;
  flex-direction: column; */
  align-self: center;

  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px;
    align-items: center;
  }

  h4 {
    margin: 0;
  }

  .body {
    border-top: 1px solid gray;
    padding: 10px;
    cursor: default;
  }

  .playlists {
    display: flex;
    height: fit-content;
    padding: 10px;
    margin: 10px;
    overflow-y: hidden;
    overflow-x: auto; /* add horizontal scrolling */
    scrollbar-width: thin;
  }
`;

// end playlist container styling

const ControlForm = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
`;

const SearchButton = styled.button`
  @media (max-width: 587px) {
    margin-top: 0.5rem;
    margin-left: 0;
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: 720px) {
    flex-direction: row;
    flex-wrap: wrap;
    margin-left: 5rem;
  }
`;

const Cards = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
  align-items: center;
  box-shadow: 0 0 10px 0 gray;
  border-radius: 15px;
  width: 310px;
  padding: 5px;
  :hover {
    background-color: #e3e3e3;
    transform: scale(0.99);
  }

  @media (min-width: 720px) {
    flex-direction: column;
    margin-right: 1rem;
    padding-top: 8px;
  }

  @media (max-width: 719px) {
    width: 98%;
  }
`;

const VideoInfo = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  padding: 0 1rem;
  text-align: center;
  align-items: center;

  input {
    accent-color: red;
    margin-right: 15px;
  }

  h3 {
    margin: 0px 8px;
  }
`;

const Thumbnail = styled.img`
  border-radius: 15px;
  cursor: pointer;

  @media (min-width: 720px) {
    width: 300px;
    height: 225px;
  }

  @media (max-width: 719px) {
    width: 150px;
  }
`;

function getFromStore(
  query: string | null,
  searchResults: YoutubeSearchResponse[]
) {
  const ONE_HOUR = 1000 * 60 * 60; // 1 hour in milliseconds

  const result = searchResults.find((result) => result.query === query);
  if (result) {
    const currentTime = new Date();
    const queryTime = new Date(result.queryTime);

    if (currentTime.getTime() - queryTime.getTime() < ONE_HOUR) {
      console.log(
        "Search results already exist in store, no need for API call"
      );
      return result;
    }
  }

  return null;
}

function BottomScroll(callback) {
  useEffect(() => {
    const determineScroll = async () => {
      // Determine if user has scrolled to bottom of page.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
        callback();
      }
    };
    // Listen, update state.
    window.addEventListener("scroll", determineScroll);
    // Clean up.
    return () => {
      window.removeEventListener("scroll", determineScroll);
    };
  }, [callback]);
}

function Search() {
  const dispatch = useAppDispatch();
  const playlists = useAppSelector((state) => state.playlists);
  const searchStore = useAppSelector((state) => state.search.searchResults);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [inputQuery, setInputQuery] = useState(query || "");
  const [selectedVideoID, setSelectedVideoID] = useState<string | null>(null);
  const user = useAppSelector((state) => state.user.info);
  const [queryResults, setQueryResults] =
    useState<YoutubeSearchResponse | null>(null);
  const [checkedVideos, setCheckedVideos] = useState<string[]>([]);

  // clicking a video will provide a pop-up modal with the video
  const handleVideoClick = (videoID: string) => {
    setSelectedVideoID(videoID);
  };

  // closing the video will remove the pop-up modal
  const handleCloseVideo = () => {
    setSelectedVideoID(null);
  };

  useEffect(() => {
    if (query) {
      const searchResults = searchStore.find(
        (result) => result.query === query
      );
      if (searchResults && searchResults.items)
        setQueryResults(searchResults ?? null);
    }
  }, [query, searchStore]);

  const YoutubeAPI = import.meta.env.VITE_YOUTUBE_API;

  const { isLoading, data } = useQuery<YoutubeSearchResponse>({
    queryKey: ["searchVideos", query],
    queryFn: async () => {
      if (!query) {
        console.log(
          "Data: No data exists, since no query has been sent. Try sending a query!"
        );
        return {};
      }

      // to use dummyData, set environment variable to true
      if (import.meta.env.VITE_USE_DUMMY_DATA === "true") {
        setQueryResults(dummyData);
        return dummyData;
      }

      // check if searchResults already exists in store
      const results = getFromStore(query, searchStore);
      if (results) {
        return results;
      }

      console.log("No search results found in store, fetching from API...");

      const searchRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${YoutubeAPI}&q=${query}&type=video&maxResults=50&safeSearch=strict&part=snippet`
      );

      const searchData = await searchRes.json();

      // add to store
      dispatch(
        addSearchResults({
          ...searchData,
          query,
          queryTime: new Date().toISOString(),
        })
      );
      return { ...searchData, query, queryTime: new Date().toISOString() };
    },
  });

  const loadMore = async () => {
    const nextPageToken = queryResults?.nextPageToken
      ? queryResults?.nextPageToken
      : "";

    const searchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${YoutubeAPI}&q=${query}&type=video&maxResults=50&safeSearch=strict&part=snippet&pageToken=${nextPageToken}`
    );
    const searchData = await searchRes.json();

    // add to store.
    dispatch(
      addPaginated({
        ...searchData,
        query,
        queryTime: new Date().toISOString(),
      })
    );
  };

  BottomScroll(loadMore);

  // check if current video is in a given playlist, returns the video if it is
  // in the form of a playlistItem, which is nested in the SinglePlaylistObj interface
  const videoInPlaylist = (playlistID: string, videoID: string) => {
    const playlist = playlists.playlists?.find(
      (playlist: SinglePlaylistObj) => playlist.id === playlistID
    );
    if (playlist) {
      const videoInPlaylist = playlist.items.find(
        (video) => video.contentDetails.videoId === videoID
      );
      return videoInPlaylist;
    }
  };

  const handleCheckboxChange = (videoID: string, isChecked: boolean) => {
    if (isChecked) {
      setCheckedVideos((prevChecked) => [...prevChecked, videoID]);
    } else {
      setCheckedVideos((prevChecked) =>
        prevChecked.filter((id) => id !== videoID)
      );
    }
  };

  // this can be deleted later, used for testing right now
  useEffect(() => {
    console.log("checked videos: ", checkedVideos);
  }, [checkedVideos]);

  // either add or remove a video from a playlist
  const handlePlaylistClick = async (playlistID: string) => {
    for (const videoID of checkedVideos) {
      const isInPlaylist = videoInPlaylist(playlistID, videoID);

      // add the video to the playlist if it's not already in it
      if (!isInPlaylist && user) {
        const playlistItem = await addVideoToPlaylistRequest(
          user.access_token,
          playlistID,
          videoID
        );
        dispatch(addVideoToPlaylist({ playlistID, playlistItem }));
      }
    }

    alert("Added all videos that were not already in your playlist");
    // Uncheck all checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    setCheckedVideos([]);
  };

  return (
    <>
      {user && (
        <>
          <h1>Search for YouTube Videos: </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSearchParams({ q: inputQuery });
            }}
          >
            <ControlForm>
              <StyledInput
                value={inputQuery}
                placeholder="Cute Cats"
                onChange={(e) => setInputQuery(e.target.value)}
              />
              <SearchButton type="submit">Search</SearchButton>
            </ControlForm>
          </form>
          {isLoading && <FoldingCube />}

          {/* playlists will only show if videoes are queried and user has playlists */}
          {queryResults &&
            playlists.playlistsOverview &&
            checkedVideos.length > 0 && (
              <PlaylistsContainer>
                <div className="header">
                  <h4>Playlists</h4>
                </div>
                <div className="body playlists">
                  {playlists.playlistsOverview.items.map((playlist) => (
                    <PlaylistItem
                      key={playlist.id}
                      onClick={() => handlePlaylistClick(playlist.id)}
                    >
                      <img src={playlist.snippet.thumbnails.default.url} />
                      <PlaylistToolTip>
                        <FontAwesomeIcon icon={faPlus} />
                        <p>{playlist.snippet.title}</p>
                      </PlaylistToolTip>
                    </PlaylistItem>
                  ))}
                </div>
              </PlaylistsContainer>
            )}

          <CardContainer>
            {queryResults &&
              queryResults.items.map((element) => (
                <Cards key={element.id.videoId}>
                  <Thumbnail
                    src={element.snippet.thumbnails.high.url}
                    alt="thumbnail"
                    onClick={() => handleVideoClick(element.id.videoId)}
                  />
                  <VideoInfo>
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        handleCheckboxChange(
                          element.id.videoId,
                          e.target.checked
                        )
                      }
                    ></input>
                    <h2>{element.snippet.title}</h2>
                  </VideoInfo>
                </Cards>
              ))}
          </CardContainer>

          {selectedVideoID && (
            <VideoModal videoID={selectedVideoID} onClose={handleCloseVideo} />
          )}
        </>
      )}
    </>
  );
}
export default Search;
