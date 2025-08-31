import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthContextProvider } from "/src/lib/AuthContext";
import "./main.css";
import App from "./App.jsx";
import NotFoundPage from "./routes/NotFoundPage.jsx";
import SignUp from "./routes/AccountForms/SignUp.jsx";
import Login from "./routes/AccountForms/Login.jsx";
import Dashboard from "./routes/Dashboard/Dashboard.jsx";
import PrivateRoute from "../components/PrivateRoute.jsx";
import PublicRoute from "../components/PublicRoute.jsx";
import UnplayedRoute from "../components/UnplayedRoute.jsx";
import ForgotPassword from "./routes/AccountForms/ForgotPassword.jsx";
import ResetPassword from "./routes/AccountForms/ResetPassword.jsx";
import Instructions from "./routes/Instructions/Instructions.jsx";
import Home from "./routes/Home.jsx";
import About from "./routes/About/About.jsx";
import PastGames from "./routes/PastGames/PastGames.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <UnplayedRoute>
        <Home />
      </UnplayedRoute>
    ),
    errorElement: <NotFoundPage />,
  },
  {
    path: "/game",
    element: (
      <UnplayedRoute>
        <App />
      </UnplayedRoute>
    ),
  },
  {
    path: "/instructions",
    element: <Instructions />,
  },
  {
    path: "/about",
    element: <About />,
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
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: (
      <PrivateRoute>
        <ResetPassword />
      </PrivateRoute>
    ),
  },
  {
    path: "/past-games",
    element: (
      <PrivateRoute>
        <PastGames />
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
