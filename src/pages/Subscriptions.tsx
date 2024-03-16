import { useAppSelector } from "../redux/hooks";

function Subscriptions() {
  const user = useAppSelector((state) => state.user.info);

  return (
    <>
      {user && (
        <h1>
          {user?.given_name
            ? `${user.given_name}'s Subscriptions`
            : "Subscriptions"}
        </h1>
      )}
    </>
  );
}

export default Subscriptions;
