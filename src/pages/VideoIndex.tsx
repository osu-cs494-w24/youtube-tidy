import { useParams } from "react-router-dom";

function VideoIndex() {
  const { VideoID } = useParams();
  return (
    <>
      <h1>
        Testing PARTICULAR Video Index page (will change based on video clicked)
        <p>
          These is a test of the video parameters. You looked for video with ID:{" "}
          {VideoID}
        </p>
      </h1>
    </>
  );
}
export default VideoIndex;
