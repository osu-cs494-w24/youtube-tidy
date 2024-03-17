import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { addSearchResults, addPaginated } from "../redux/searchSlice";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import FoldingCube from "../components/FoldingCube";
import styled from "@emotion/styled";
import { YoutubeSearchResponse } from "../assets/interfaces";
import VideoModal from "../components/VideoModal";

const StyledInput = styled.input`
  /* padding-top: 1rem;
  padding-bottom: 1rem; */
  font-size: 2rem;
  border-radius: 7px;
`;

import dData from "../dummyData/SearchResults.json";
const dummyData = {
  ...dData,
  query: "cute cats",
  queryTime: new Date().toISOString(),
};

const ContainerCards = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-self: center;
  align-content: center;
  justify-content: center;
  @media (min-width: 587px) {
    flex-direction: row;
  }
`;

const CardTotal = styled.div`
  display: flex;
  flex-direction: column;
  color: #000000;
  border: 1px solid #e3e3e3;
  margin-bottom: 1rem;
  border-radius: 7px;
  padding: 1rem;
  max-width: 50%;
  margin: 1rem;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  cursor: pointer;
  @media (min-width: 587px) {
    max-width: 35%;
  }
  @media (min-width: 720px) {
    max-width: 25%;
  }
`;

const ControlForm = styled.div`
  margin-bottom: 1rem;
  display: flex;
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
  const searchStore = useAppSelector((state) => state.search.searchResults);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [inputQuery, setInputQuery] = useState(query || "");
  const [selectedVideoID, setSelectedVideoID] = useState<string | null>(null);
  const user = useAppSelector((state) => state.user.info);
  const [queryResults, setQueryResults] =
    useState<YoutubeSearchResponse | null>(null);

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

  // Just a reminder - When writing functionality, please try not to fill the API quota limit by endlessly testing an API endpoint fetch - otherwise we can't use it, or have to make another Google Cloud project with new API key. If you're worried about reaching the quota limit, export the response data from the endpoint, import it, and utilize it as dummy data (to prevent further API calls that may reach its limit for the day).

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

      // to use dummyData, set environement variable to true
      if (import.meta.env.VITE_USE_DUMMY_DATA === "true") {
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
              <button type="submit">Search</button>
            </ControlForm>
          </form>
          {isLoading && <FoldingCube />}
          <ContainerCards>
            <Card>
              {queryResults &&
                queryResults.items.map((element) => (
                  <CardTotal
                    key={element.id.videoId}
                    onClick={() => handleVideoClick(element.id.videoId)}
                  >
                    <h2>{element.snippet.title}</h2>
                    <img src={element.snippet.thumbnails.high.url} />
                    <p>{element.snippet.description}</p>
                  </CardTotal>
                ))}
            </Card>
          </ContainerCards>

          {selectedVideoID && (
            <VideoModal videoID={selectedVideoID} onClose={handleCloseVideo} />
          )}
        </>
      )}
    </>
  );
}
export default Search;
