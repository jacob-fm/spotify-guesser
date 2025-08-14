import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthContextProvider } from "/src/lib/AuthContext";
import "./main.css";
import App from "./App.jsx";
import NotFoundPage from "./routes/NotFoundPage.jsx";
import SignUp from "./routes/LoginAndSignUp/SignUp.jsx";
import Login from "./routes/LoginAndSignUp/Login.jsx";
import Dashboard from "./routes/Dashboard.jsx";
import PrivateRoute from "../components/PrivateRoute.jsx";
import PublicRoute from "../components/PublicRoute.jsx";
import ForgotPassword from "./routes/ForgotPassword.jsx";
import ResetPassword from "./routes/ResetPassword.jsx";
import Instructions from "./routes/Instructions/Instructions.jsx";
import Home from "./routes/Home.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/game",
    element: <App />,
  },
  {
    path: "/instructions",
    element: <Instructions />,
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <SignUp />
      </PublicRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <PublicRoute>
        <ForgotPassword />
      </PublicRoute>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <PrivateRoute>
        <ResetPassword />
      </PrivateRoute>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </StrictMode>,
);
