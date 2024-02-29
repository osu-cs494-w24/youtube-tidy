import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
// import YouTube from "react-youtube";
import FoldingCube from "../components/FoldingCube";
import styled from "@emotion/styled";
import { YoutubeItem, YoutubeSearchResponse } from "../assets/interfaces";
import dummyData from "../dummyData/SearchResults.json";

const Card = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  @media (min-width: 587px) {
    flex-direction: row;
  }
`;

const CardTotal = styled.div`
  display: flex;
  flex-direction: column;
  color: #000000;
  border: 2px solid black;
  margin-bottom: 1rem;
  border-radius: 7px;
  padding: 1rem;
  max-width: 25%;
  margin: 1rem;
`;

const ControlForm = styled.div`
  margin-bottom: 1rem;
`;

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [inputQuery, setInputQuery] = useState(query || "");

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

      const searchRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${YoutubeAPI}&q=${query}&type=video&maxResults=5&safeSearch=strict&part=snippet`
      );

      // to use dummyData, uncomment the next line
      // return dummyData

      const searchData = await searchRes.json();
      // console.log("SEARCH DATA: ", searchData["items"]);

      // const searchListIndices =
      //   searchData["items"] &&
      //   searchData["items"].map((item: any, index: number) => index);
      // console.log("INDICES?: ", searchListIndices);

      return searchData;
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
          <input
            value={inputQuery}
            placeholder="Cute Cats"
            onChange={(e) => setInputQuery(e.target.value)}
          />
          <button type="submit">Search YouTube</button>
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
      <Card>
        {data &&
          data.items &&
          data.items.map((item: YoutubeItem) => (
            <CardTotal key={item.id.videoId}>
              <h2>{item.snippet.title}</h2>
              <img src={item.snippet.thumbnails.high.url} />
              <p>{item.snippet.description}</p>
            </CardTotal>
          ))}
      </Card>
    </>
  );
}
export default Search;
