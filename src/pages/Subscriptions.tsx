import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { loadSubscriptions } from "../redux/subscriptionsSlice";


function Subscriptions() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.info);
  const { subscriptionList, loading } = useAppSelector( ( state )=> state.subscriptions );

  useEffect(() => {
    // This is a fake access token while using dummy data
    dispatch(loadSubscriptions("1234"));
    }, []);


  return (
    <>
      <h1>
        {user?.given_name
          ? `${user.given_name}'s Subscriptions`
          : "Subscriptions"}
      </h1>
      {console.log("== subscriptionList", subscriptionList)}
      {loading === "fulfilled"
      ? subscriptionList.map((subscription) => (
          <p key={subscription.id}>text</p> // assuming 'id' and 'name' are properties of 'subscription'
        ))
      : "loading..."}
    </>
  );
}

export default Subscriptions;
