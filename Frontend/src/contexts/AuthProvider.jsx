import React, { createContext, useContext, useState } from "react";

import { BASE_URL } from "../constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoggedIn, setIsLoggedIn] = useState(JSON.parse(localStorage.getItem("login")));
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  async function handleLogin({ address, role, logOrSign }) {
    try {
      setIsLoading(true);
      
      const res = await axios.post(`${BASE_URL}/${role}/${logOrSign}`, {
        address,
      });
      
      console.log(res);
      const token = res?.data.token;
      setToken(token);
      setIsLoggedIn(true);
      localStorage.setItem("token", token);
      localStorage.setItem("login", true);
      
      return {message: res?.data.message};
    } catch (e) {
      console.error(e, "🚀🚀");
      return {error: e.message};
    } finally {
      setIsLoading(false);
    }
  }
  function handleLogout() {
    setToken("");
    setIsLoggedIn(false);
    localStorage.setItem("token", "");
    localStorage.setItem("login", false);
    navigate('/');
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
        role, 
        setRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
