import axios from "axios";
import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("login"));
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin({ address, role, logOrSign }) {
    try {
      setIsLoading(true);
      console.log(address);
      const res = await axios.post(`${BASE_URL}/${role}/${logOrSign}`, {
        address,
      });
      console.log(res);
      const token = res.data.token;
      setToken(token);
      setIsLoggedIn(true);
      localStorage.setItem("token", token);
      localStorage.setItem("login", true);
      navigate(`/${role}/task`);
    } catch (e) {
      console.error(e.response.data.message, "🚀🚀");
    } finally {
      setIsLoading(false);
    }
  }
  function handleLogout() {
    setToken("");
    setIsLoggedIn(false);
    localStorage.setItem("token", "");
    localStorage.setItem("login", false);
  }
  return (
    <AuthContext.Provider
      value={{
        token,
        isLoggedIn,
        setToken,
        setIsLoggedIn,
        handleLogin,
        handleLogout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
