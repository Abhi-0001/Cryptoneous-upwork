import React, { useState } from "react";

import LoginForm from "../components/LoginForm";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

const LoginPage = () => {
  const {isLoggedIn} = useAuth();
  return (
    <div className="flex justify-center">
{ isLoggedIn ? <Navigate to='../user/task' />:
      <LoginForm />}
    </div>
  );
};

export default LoginPage;
