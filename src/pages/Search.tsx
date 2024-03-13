import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { addSearchResults } from "../redux/searchSlice";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import FoldingCube from "../components/FoldingCube";
import styled from "@emotion/styled";
import { YoutubeSearchResponse } from "../assets/interfaces";
import VideoModal from "../components/VideoModal";

const StyledInput = styled.input`
  padding-top: 1rem;
  padding-bottom: 1rem;
  font-size: 1rem;
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
  /* align-content: center; */

  @media (min-width: 587px) {
    flex-direction: row;
  }
`;

const CardTotal = styled.div`
  display: flex;
  flex-direction: column;
  color: #000000;
  border: 1px solid black;
  margin-bottom: 1rem;
  border-radius: 7px;
  padding: 1rem;
  max-width: 25%;
  margin: 1rem;
  cursor: pointer;
`;

const ControlForm = styled.div`
  margin-bottom: 1rem;
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

function Search() {
  const dispatch = useAppDispatch();
  const searchResults = useAppSelector((state) => state.search.searchResults);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [inputQuery, setInputQuery] = useState(query || "");
  const [selectedVideoID, setSelectedVideoID] = useState<string | null>(null);

  // clicking a video will provide a pop-up modal with the video
  const handleVideoClick = (videoID: string) => {
    setSelectedVideoID(videoID);
  };

  // closing the video will remove the pop-up modal
  const handleCloseVideo = () => {
    setSelectedVideoID(null);
  };

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
      const results = getFromStore(query, searchResults);
      if (results) {
        return results;
      }

      console.log("No search results found in store, fetching from API...");

      const searchRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${YoutubeAPI}&q=${query}&type=video&maxResults=6&safeSearch=strict&part=snippet`
      );

      const searchData = await searchRes.json();
      // console.log("SEARCH DATA: ", searchData["items"]);

      // const searchListIndices =
      //   searchData["items"] &&
      //   searchData["items"].map((item: any, index: number) => index);
      // console.log("INDICES?: ", searchListIndices);

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
  return (
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
      {/* {console.log("Data?: ", data)}
      {console.log("Search Data: ", data?.searchData)}
      {console.log(
        data?.searchData,
        "Testing generic data pull...",
        data?.searchData
      )} */}
      {isLoading && <FoldingCube />}
      <ContainerCards>
        <Card>
          {data &&
            data.items &&
            data.items.map((video) => (
              <CardTotal
                key={video.id.videoId}
                onClick={() => handleVideoClick(video.id.videoId)}
              >
                <h2>{video.snippet.title}</h2>
                <img src={video.snippet.thumbnails.high.url} />
                <p>{video.snippet.description}</p>
              </CardTotal>
            ))}
        </Card>
      </ContainerCards>

      {selectedVideoID && (
        <VideoModal videoID={selectedVideoID} onClose={handleCloseVideo} />
      )}
    </>
  );
}
export default Search;
