import { Navigate } from "react-router-dom";

const UnplayedRoute = ({ children }) => {
  const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
  const playedToday = localStorage.getItem("lastPlayedDate") === today;
  return <>{!playedToday ? <>{children}</> : <Navigate to="/dashboard" />}</>;
};

export default UnplayedRoute;
