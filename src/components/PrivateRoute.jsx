import { UserAuth } from "../lib/AuthContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
	const { session } = UserAuth();
	return <>{session ? <>{children}</> : <Navigate to="/signup" />}</>;
};

export default PrivateRoute;
