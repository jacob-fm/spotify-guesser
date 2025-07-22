import { UserAuth } from "../lib/AuthContext";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
	const { session } = UserAuth();
	return <>{!session ? <>{children}</> : <Navigate to="/dashboard" />}</>;
};

export default PublicRoute;
