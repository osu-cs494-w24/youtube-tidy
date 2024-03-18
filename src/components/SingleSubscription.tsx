import styled from "@emotion/styled";
import { Subscription } from "../assets/interfaces";

const ControlItems = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
`;

const ControlInput = styled.div`
  display: flex;
  align-self: flex-start;
`;

const Card = styled.div`
  border: 1px solid #e3e3e3;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  margin-bottom: 1rem;
  border-radius: 15px;
  padding-bottom: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
  flex-grow: 1;
  max-width: 100%;
  @media (min-width: 720px) {
    min-width: 40%;
    max-width: 40%;
  }
  margin-right: 1rem;
`;

const Bundle = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem;
  padding: 1rem;
  max-width: 125px;
  max-height: 125px;
  border: 1px solid #e3e3e3;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  img {
    flex-grow: 1;
  }
`;

const ContainText = styled.p`
  flex-wrap: wrap;
  word-break: break-word;
`;

interface SubScriptionItemProps {
  isSelected: boolean;
}

interface SingleSubscriptionProps {
  subscriptionData: Subscription;
  handleSelect: (subscriptionId: string, isSelected: boolean) => void;
  isSelected: boolean;
}

const SubscriptionItem = styled.div<SubScriptionItemProps>`
  display: flex;
  background-color: ${(props) => (props.isSelected ? "lightpink" : "white")};
`;

export default function SingleSubscription({
  subscriptionData,
  handleSelect,
  isSelected,
}: SingleSubscriptionProps) {
  const BASE_URL = "https://www.youtube.com/channel/";
  const thumbnail = subscriptionData.snippet.thumbnails.default.url;
  const title = subscriptionData.snippet.title;
  const description = subscriptionData.snippet.description;
  const channelId = subscriptionData.snippet.resourceId.channelId;
  const channelUrl = BASE_URL + channelId;
  const subscriptionId = subscriptionData.id;

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSelect(subscriptionId, e.target.checked);
  };

  return (
    <>
      <Card>
        <SubscriptionItem isSelected={isSelected}>
          {/* <p> */}
          <Bundle>
            {/* </p> */}
            <img src={thumbnail} alt="thumbnail" />
            <a href={channelUrl}>{title}</a>
          </Bundle>
          <ControlItems>
            <ContainText>{description}</ContainText>
            <ControlInput>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={handleCheckboxChange}
              ></input>
            </ControlInput>
          </ControlItems>
          {/* <hr></hr> */}
        </SubscriptionItem>
      </Card>
    </>
  );
}
