import { useAppSelector } from "../redux/hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Subscriptions() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.info);

  // redirect to root page if user is not authenticated
  useEffect(() => {
    if (!user?.access_token) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <h1>
      {user?.given_name
        ? `${user.given_name}'s Subscriptions`
        : "Subscriptions"}
    </h1>
  );
}

export default Subscriptions;
