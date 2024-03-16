import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  loadSubscriptions,
  removeSubscriptions,
} from "../redux/subscriptionsSlice";
import SingleSubscription from "../components/SingleSubscription";
import { removeChannelsFromSubscriptions } from "../requests/SubscriptionActions";

function Subscriptions() {
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<string[]>(
    []
  );
  const [allSelected, setAllSelected] = useState<bool>(false);
  const [unsubscribedClicked, setUnsubscribedClicked] = useState<bool>(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.info);
  const { subscriptionList, loading } = useAppSelector(
    (state) => state.subscriptions
  );

  useEffect(() => {
    // This is a fake access token while using dummy data
    dispatch(loadSubscriptions("1234"));
  }, []);

  function handleSelect(subscriptionId: string, isSelected: bool) {
    // console.log("== subscriptionId", subscriptionId);
    // console.log("== isSelected", isSelected);
    if (isSelected) {
      // console.log("hereherhehere");
      setSelectedSubscriptions([...selectedSubscriptions, subscriptionId]);
    } else {
      const updatedSelectedSubs = selectedSubscriptions.filter(
        (subscription) => subscription !== subscriptionId
      );

      setSelectedSubscriptions(updatedSelectedSubs);
    }
    setUnsubscribedClicked(false);
  }

  function handleSelectAll() {
    if (!allSelected) {
      setSelectedSubscriptions(
        subscriptionList.map((subscription) => subscription.id)
      );
    } else {
      setSelectedSubscriptions([]);
    }
    setAllSelected(!allSelected);
    setUnsubscribedClicked(false);
  }

  function updateStateAfterUnsubscribe() {
    dispatch(removeSubscriptions(selectedSubscriptions));
    setUnsubscribedClicked(false);
    setAllSelected(false);
    setSelectedSubscriptions([]);
  }

  async function handleUnsubscribe() {
    let success = false;

    if (import.meta.env.VITE_USE_DUMMY_DATA === "true") {
      updateStateAfterUnsubscribe();
    } else {
      if (user) {
        success = await removeChannelsFromSubscriptions(
          user.access_token,
          selectedSubscriptions
        );
        if (success) {
          updateStateAfterUnsubscribe();
        }
      }
    }
  }

  return (
    <>
      <h1>
        {user?.given_name
          ? `${user.given_name}'s Subscriptions`
          : "Subscriptions"}
      </h1>
      <div>
        <button onClick={handleSelectAll}>
          {allSelected ? "Unselect" : "Select"} all
        </button>
        {unsubscribedClicked && selectedSubscriptions.length > 0 ? (
          <button onClick={handleUnsubscribe}>
            Confirm unsubscribe from {selectedSubscriptions.length} channels?
          </button>
        ) : (
          <button onClick={() => setUnsubscribedClicked(true)}>
            Unsubscribe
          </button>
        )}
      </div>
      {loading === "fulfilled"
        ? subscriptionList.map((subscriptionData) => (
            <SingleSubscription
              key={subscriptionData.id}
              subscriptionData={subscriptionData}
              handleSelect={handleSelect}
              isSelected={
                allSelected ||
                selectedSubscriptions.includes(subscriptionData.id)
              }
            />
          ))
        : ""}
    </>
  );
}

export default Subscriptions;
