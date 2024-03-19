import styled from "@emotion/styled";

const SubButtons = styled.button`
  display: inline-flex;
  flex: 0 0 100%;
  margin-bottom: 1rem;
  :hover {
    box-shadow: 10px 5px 5px rgba(252, 210, 211, 0.5);
  }
`;

const ContainerButtons = styled.div`
  flex: 0 0 100%;
`;

interface SubscriptionControlPanelProps {
  handleSelectAll: () => void;
  allSelected: boolean;
  unsubscribeClicked: boolean;
  selectedSubscriptions: string[];
  handleUnsubscribe: () => void;
  setUnsubscribedClicked: (setUnsubscribed: boolean) => void;
}

export default function SubscriptionControlPanel({
  handleSelectAll,
  allSelected,
  unsubscribeClicked,
  selectedSubscriptions,
  handleUnsubscribe,
  setUnsubscribedClicked,
}: SubscriptionControlPanelProps) {
  return (
    <ContainerButtons>
      <SubButtons onClick={handleSelectAll}>
        {allSelected ? "Unselect" : "Select"} all
      </SubButtons>
      {unsubscribeClicked && selectedSubscriptions.length > 0 ? (
        <SubButtons onClick={handleUnsubscribe}>
          Confirm unsubscribe from {selectedSubscriptions.length} channels?
        </SubButtons>
      ) : (
        <SubButtons onClick={() => setUnsubscribedClicked(true)}>
          Unsubscribe
        </SubButtons>
      )}
    </ContainerButtons>
  );
}
