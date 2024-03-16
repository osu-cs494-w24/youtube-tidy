import { Subscription } from "../assets/interfaces";
import SingleSubscription from "./SingleSubscription";

interface AllSubscriptionsProps {
  subscriptionList: Subscription[];
  handleSelect: (subscriptionId: string, isSelected: boolean) => void;
  allSelected: boolean;
  selectedSubscriptions: string[];
  status: string;
}

export default function AllSubscriptions({
  subscriptionList,
  handleSelect,
  allSelected,
  selectedSubscriptions,
  status,
}: AllSubscriptionsProps) {
  if (status === "pending") return <div>Loading...</div>;
  if (status === "error") return <div>Error with retrieving subscriptions</div>;
  return (
    <>
      {subscriptionList.map((subscriptionData) => (
        <SingleSubscription
          key={subscriptionData.id}
          subscriptionData={subscriptionData}
          handleSelect={handleSelect}
          isSelected={
            allSelected || selectedSubscriptions.includes(subscriptionData.id)
          }
        />
      ))}
    </>
  );
}
