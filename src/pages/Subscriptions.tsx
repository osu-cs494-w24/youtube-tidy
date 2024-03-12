import { useAppSelector } from "../redux/hooks";
import Login from "../components/Login";

function Subscriptions() {
  const user = useAppSelector((state) => state.user.info);

  return (
    <>
      <Login />
      <h1>
        {user?.given_name
          ? `${user.given_name}'s Subscriptions`
          : "Subscriptions"}
      </h1>
    </>
  );
}

export default Subscriptions;
