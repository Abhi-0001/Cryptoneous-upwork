import React, { useContext } from "react";
import { useAuth } from "../contexts/AuthProvider";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
  const { token, isLoggedIn } = useAuth();

  if (!(isLoggedIn && token)) return <Navigate to={"/login"} />;

  return <Outlet />;
}

export default ProtectedRoute;
