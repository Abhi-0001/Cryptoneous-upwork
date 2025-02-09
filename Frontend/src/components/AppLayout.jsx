import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import NavBar from "./NavBar";
import { useState } from "react";

export default function AppLayout() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="flex flex-col h-[100vh] justify-between overflow-hidden p-4 w-100%">
        <NavBar isLoggedIn={loggedIn} />
        <Outlet />
        <Footer />
    </div>
  )
}