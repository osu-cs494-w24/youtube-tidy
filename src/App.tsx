import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; Have this installed, unsure what page it will be used yet.
import Search from "./Search";
import Root from "./Routes";
import VideoIndex from "./VideoIndex";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "search",
          element: <Search />,
        },
        {
          path: "search/:VideoID",
          element: <VideoIndex />,
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
