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
    <div>
      <button onClick={handleSelectAll}>
        {allSelected ? "Unselect" : "Select"} all
      </button>
      {unsubscribeClicked && selectedSubscriptions.length > 0 ? (
        <button onClick={handleUnsubscribe}>
          Confirm unsubscribe from {selectedSubscriptions.length} channels?
        </button>
      ) : (
        <button onClick={() => setUnsubscribedClicked(true)}>
          Unsubscribe
        </button>
      )}
    </div>
  );
}
