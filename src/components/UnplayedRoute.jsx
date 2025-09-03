import { Navigate } from "react-router-dom";
import { UserAuth } from "../lib/AuthContext";

const UnplayedRoute = ({ children }) => {
  const { todaysGameExistsInSupabase } = UserAuth();
  const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
  const playedToday = localStorage.getItem("lastDateCompleted") === today;
  return (
    <>
      {(!playedToday && !todaysGameExistsInSupabase)
        ? <>{children}</>
        : <Navigate to="/dashboard" />}
    </>
  );
};

export default UnplayedRoute;
