import React, { useState } from "react";

import axios from "axios";

import { BASE_URL } from "../constants";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  const [address, setAddress] = useState("");
  const [logOrSign, setLogOrSign] = useState("signin");
  const [role, setRole] = useState("user");

  async function handleLogin(e) {
    e.preventDefault();
  }

  return (
    <div className="flex justify-center">
      <LoginForm
        setRole={setRole}
        formType={logOrSign}
        setLogOrSign={setLogOrSign}
        handleLogin={handleLogin}
        role={role}
        setAddress={setAddress}
      />
    </div>
  );
};

export default LoginPage;
