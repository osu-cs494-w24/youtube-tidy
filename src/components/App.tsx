import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Global } from "@emotion/react";

import Search from "../pages/Search";
import Root from "./Routes";
// import VideoIndex from "../pages/VideoIndex"; // Likely won't use this.
import Theme from "../assets/Theme";
import Playlists from "../pages/Playlists";
import Subscriptions from "../pages/Subscriptions";
import Homepage from "../pages/Homepage";

function App() {
  const queryClient = new QueryClient();
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        { index: true, element: <Homepage /> },
        {
          path: "playlists",
          element: <Playlists />,
        },
        {
          path: "subscriptions",
          element: <Subscriptions />,
        },
        {
          path: "search",
          element: <Search />,
        },
        //  Likely won't use this route.
        // {
        //   path: "search/:VideoID",
        //   element: <VideoIndex />,
        // },
      ],
    },
  ]);
  return (
    <>
      <Global styles={Theme()} />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  );
}

export default App;
