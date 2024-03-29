import styled from "@emotion/styled";
import { Subscription } from "../assets/interfaces";
import { BigCheckbox } from "./BigCheckbox";

const ControlItems = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
`;

const ControlInput = styled.div`
  display: flex;
  align-items: center;
`;

const Card = styled.label`
  border: 1px solid #e3e3e3;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  margin-bottom: 1rem;
  border-radius: 15px;
  padding: 1rem;
  flex-grow: 1;
  max-width: 100%;
  &:hover {
    background-color: #e3e3e3;
  }
  @media (min-width: 720px) {
    min-width: 40%;
    max-width: 40%;
  }
  margin-right: 1rem;
`;

const Bundle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 1rem;
  margin-right: 1rem;
  margin-top: 0rem;
  margin-bottom: 0rem;
  padding: 1rem;
  width: 125px;
  height: 125px;
  border: 1px solid #e3e3e3;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  img {
    flex-grow: 1;
    max-height: 70%;
    object-fit: contain;
  }
  h3 {
    text-align: center;
    display: block;
    font-size: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 0.5rem;
    margin-bottom: 0rem;
  }
`;

const SubscriptionTitle = styled.a`
  text-decoration: none;
  color: black;
  max-height: 90%;
  &:hover {
    color: red;
    text-decoration: underline;
  }
  &:active {
    color: darkred;
  }
`;

const ContainText = styled.p`
  flex-wrap: wrap;
  word-break: break-word;
`;

const ContainPlaceholderText = styled(ContainText)`
  font-style: italic;
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
  /* background-color: ${(props) =>
    props.isSelected ? "lightpink" : "white"}; */
  :hover {
    transform: scale(0.99);
  }
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
          <ControlInput>
            <BigCheckbox
              type="checkbox"
              checked={isSelected}
              onChange={handleCheckboxChange}
            ></BigCheckbox>
          </ControlInput>
          <Bundle>
            <img
              src={thumbnail}
              alt={"thumbnail for channel '" + title + "'"}
            />
            <h3>
              <SubscriptionTitle
                href={channelUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {title}
              </SubscriptionTitle>
            </h3>
          </Bundle>
          <ControlItems>
            {description.length ? (
              <ContainText>
                {description.slice(0, 100)}
                {description.length > 100 ? "..." : null}
              </ContainText>
            ) : (
              <ContainPlaceholderText>
                (No description provided)
              </ContainPlaceholderText>
            )}
          </ControlItems>
        </SubscriptionItem>
      </Card>
    </>
  );
}
