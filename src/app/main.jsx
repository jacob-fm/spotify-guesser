import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthContextProvider } from "/src/lib/AuthContext";
import "./main.css";
import App from "./App.jsx";
import SignUp from "./routes/SignUp.jsx";
import NotFoundPage from "./routes/NotFoundPage.jsx";
import Login from "./routes/Login.jsx";
import Dashboard from "./routes/Dashboard.jsx";
import PrivateRoute from "../components/PrivateRoute.jsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <NotFoundPage />,
	},
	{
		path: "/signup",
		element: <SignUp />,
	},
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/dashboard",
		element: (
			<PrivateRoute>
				<Dashboard />
			</PrivateRoute>
		),
	},
]);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<AuthContextProvider>
			<RouterProvider router={router} />
		</AuthContextProvider>
	</StrictMode>
);
