import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  loadSubscriptions,
  removeSubscriptions,
} from "../redux/subscriptionsSlice";
import { removeChannelsFromSubscriptions } from "../requests/SubscriptionActions";
import SubscriptionControlPanel from "../components/SubscriptionControlPanel";
import AllSubscriptions from "../components/AllSubscriptions";

import styled from "@emotion/styled";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

function Subscriptions() {
  const dispatch = useAppDispatch();
  const [allSelected, setAllSelected] = useState<boolean>(false);
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<string[]>(
    []
  );
  const [unsubscribeClicked, setUnsubscribedClicked] = useState<boolean>(false);
  const user = useAppSelector((state) => state.user.info);
  const { subscriptionList, status } = useAppSelector(
    (state) => state.subscriptions
  );

  /* This useEffect block is useful for development purposes
   it allows the user to be logged out and still retrieve dummy data */

  // useEffect(() => {
  //   // This is a fake access token while using dummy data
  //   dispatch(loadSubscriptions("1234"));
  // }, []);

  // Handles a single video being selected
  function handleSelect(subscriptionId: string, isSelected: boolean) {
    if (isSelected) {
      // Add a subscription to the state variable
      setSelectedSubscriptions([...selectedSubscriptions, subscriptionId]);
    } else {
      // Remove a subscription from the state variable
      const updatedSelectedSubs = selectedSubscriptions.filter(
        (subscription) => subscription !== subscriptionId
      );
      setSelectedSubscriptions(updatedSelectedSubs);
    }
    setUnsubscribedClicked(false);
  }

  // Handles a selecting/unselecting all videos
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

  // Resets state after unsubscribe is clicked
  function updateStateAfterUnsubscribe() {
    dispatch(removeSubscriptions(selectedSubscriptions));
    setUnsubscribedClicked(false);
    setAllSelected(false);
    setSelectedSubscriptions([]);
  }

  // Removes subscriptions from the store and makes the delete call to the youtube API
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
      {user && (
        <>
          <h1>
            {user?.given_name
              ? `${user.given_name}'s Subscriptions`
              : "Subscriptions"}
          </h1>
          <Container>
            <SubscriptionControlPanel
              handleSelectAll={handleSelectAll}
              allSelected={allSelected}
              unsubscribeClicked={unsubscribeClicked}
              selectedSubscriptions={selectedSubscriptions}
              handleUnsubscribe={handleUnsubscribe}
              setUnsubscribedClicked={setUnsubscribedClicked}
            />
            <AllSubscriptions
              subscriptionList={subscriptionList}
              handleSelect={handleSelect}
              allSelected={allSelected}
              selectedSubscriptions={selectedSubscriptions}
              status={status}
            />
          </Container>
        </>
      )}
    </>
  );
}

export default Subscriptions;
