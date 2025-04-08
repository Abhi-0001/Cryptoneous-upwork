import { Navigate, Outlet } from "react-router-dom";

import React from "react";
import { useAuth } from "../contexts/AuthProvider";

export function ProtectedRouteWorker() {
  const { token, isLoggedIn, role } = useAuth();

  if (!(isLoggedIn && token && role != 'worker')) return <Navigate to={"/login"} />;

  return <Outlet />;
}

export default ProtectedRouteWorker;
