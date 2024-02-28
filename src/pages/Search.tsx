import { useSearchParams } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import YouTube from "react-youtube";
// import FoldingCube from "./FoldingCube";

// using dummy data while API is down
const dummyData = {
  kind: "youtube#searchListResponse",
  etag: "uc3Hf21vt6xqJewX5Y8UiSFjsXQ",
  nextPageToken: "CAUQAA",
  regionCode: "US",
  pageInfo: {
    totalResults: 1000000,
    resultsPerPage: 5,
  },
  items: [
    {
      kind: "youtube#searchResult",
      etag: "3-lbqEoe2_aLPh4ZCKWPwl9OWAU",
      id: {
        kind: "youtube#video",
        videoId: "y0sF5xhGreA",
      },
    },
    {
      kind: "youtube#searchResult",
      etag: "a1tALiFEHzRgaMVrrf3Vz3e3nSs",
      id: {
        kind: "youtube#video",
        videoId: "wdjpworLSk8",
      },
    },
    {
      kind: "youtube#searchResult",
      etag: "D9e5dmu3epwZoskQf3W0rF2eHFg",
      id: {
        kind: "youtube#video",
        videoId: "S3TUOWdC0y0",
      },
    },
    {
      kind: "youtube#searchResult",
      etag: "lG4XK5a5x3E4Hy-x5I4iQGvbxuk",
      id: {
        kind: "youtube#video",
        videoId: "3bhkYoMWTFE",
      },
    },
    {
      kind: "youtube#searchResult",
      etag: "_9b1h7IUl8MqJgsjVPOJLrhYZx8",
      id: {
        kind: "youtube#video",
        videoId: "1ZNLpoglNnM",
      },
    },
  ],
};

// console.log("Video player...", videoIDArr);

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [inputQuery, setInputQuery] = useState(query || "");

  const Videos = dummyData["items"].map((obj: any) => (
    <YouTube videoId={obj["id"]["videoId"]} key={obj["id"]["videoId"]} />
  ));

  // USING DUMMY DATA WHILE API IS DOWN FOR QUOTA USAGE //

  // const YoutubeAPI = import.meta.env.VITE_YOUTUBE_API;

  // const { data, isLoading } = useQuery({
  //   queryKey: ["searchVideos", query],
  //   queryFn: async () => {
  //     if (!query) {
  //       console.log(
  //         "Data: No data exists, since no query has been sent. Try sending a query!"
  //       );
  //       return {};
  //     }
  //     const vidRes = await fetch(
  //       `https://www.googleapis.com/youtube/v3/search?key=${YoutubeAPI}&q=${query}&type=video&maxResults=10`
  //     );
  //     const vidData = await vidRes.json();
  //     return vidData;
  //   },
  // });

  // USING DUMMY DATA WHILE API IS DOWN FOR QUOTA USAGE //

  return (
    <>
      <h1>Search for Videos: </h1>
      {console.log("QUERY IS...:", query)}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSearchParams({ q: inputQuery });
        }}
      >
        <input
          value={inputQuery}
          placeholder="Cute Cats"
          onChange={(e) => setInputQuery(e.target.value)}
        />
        <button type="submit">Search YouTube</button>
      </form>
      <div>{Videos}</div>
    </>
  );
}
export default Search;
