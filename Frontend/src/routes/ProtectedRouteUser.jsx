import { Navigate, Outlet } from "react-router-dom";

import React from "react";
import { useAuth } from "../contexts/AuthProvider";

export function ProtectedRouteUser() {
  const { token, isLoggedIn, role } = useAuth();

  console.log(role);
  if (!(isLoggedIn && token && (role != 'user'))) return <Navigate to={"/login"} />;

  return <Outlet />;
}

export default ProtectedRouteUser;
