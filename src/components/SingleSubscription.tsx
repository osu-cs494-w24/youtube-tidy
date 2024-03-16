import { useState } from "react";
import styled from "@emotion/styled";

const SubscriptionItem = styled.div`
  background-color: ${(props) => (props.isSelected ? "lightpink" : "white")};
`;

export default function SingleSubscription({ subscriptionData, handleSelect }) {
  const [isSelected, setIsSelected] = useState(false);

  const BASE_URL = "https://www.youtube.com/channel/";
  const thumbnail = subscriptionData.snippet.thumbnails.default.url;
  const title = subscriptionData.snippet.title;
  const description = subscriptionData.snippet.description;
  const channelId = subscriptionData.snippet.resourceId.channelId;
  const channelUrl = BASE_URL + channelId;
  const subscriptionId = subscriptionData.id;

  const handleCheckboxChange = (e) => {
    setIsSelected(e.target.checked);
    handleSelect(subscriptionId, e.target.checked);
  };

  return (
    <SubscriptionItem isSelected={isSelected}>
      <p>
        <a href={channelUrl}>{title}</a>
      </p>
      <img src={thumbnail} alt="thumbnail" />
      <p>{description}</p>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={handleCheckboxChange}
      ></input>
      <hr></hr>
    </SubscriptionItem>
  );
}
