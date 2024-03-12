import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Global } from "@emotion/react";

import Search from "../pages/Search";
import Root from "./Routes";
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
      ],
    },
  ]);
  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
        <Global styles={Theme()} />
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
