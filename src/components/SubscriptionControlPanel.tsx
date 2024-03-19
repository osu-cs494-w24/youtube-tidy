import styled from "@emotion/styled";
import { Subscription } from "../assets/interfaces";

const SubButtons = styled.button`
  display: inline-flex;
  flex: 0 0 100%;
  margin-bottom: 1rem;
  :hover {
    box-shadow: 10px 5px 5px rgba(252, 210, 211, 0.5);
  }
  &:disabled {
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const ContainerButtons = styled.div`
  flex: 0 0 100%;
`;

interface SubscriptionControlPanelProps {
  subscriptionList: Subscription[];
  handleSelectAll: () => void;
  unsubscribeClicked: boolean;
  selectedSubscriptions: string[];
  handleUnsubscribe: () => void;
  setUnsubscribedClicked: (setUnsubscribed: boolean) => void;
}

export default function SubscriptionControlPanel({
  subscriptionList,
  handleSelectAll,
  unsubscribeClicked,
  selectedSubscriptions,
  handleUnsubscribe,
  setUnsubscribedClicked,
}: SubscriptionControlPanelProps) {
  return (
    <ContainerButtons>
      <SubButtons onClick={handleSelectAll} disabled={!subscriptionList.length}>
        {!subscriptionList.length ||
        subscriptionList.length !== selectedSubscriptions.length
          ? "Select all"
          : "Unselect all"}
      </SubButtons>
      {unsubscribeClicked && selectedSubscriptions.length > 0 ? (
        <SubButtons onClick={handleUnsubscribe}>
          Confirm unsubscribe from {selectedSubscriptions.length} channels?
        </SubButtons>
      ) : (
        <SubButtons
          onClick={() => setUnsubscribedClicked(true)}
          disabled={selectedSubscriptions.length == 0}
        >
          Unsubscribe
        </SubButtons>
      )}
    </ContainerButtons>
  );
}
