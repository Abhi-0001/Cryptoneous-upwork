import Button from "../ui/Button";
import { HiMiniUserCircle } from "react-icons/hi2";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

export default function NavBar() {
  const { isLoggedIn, handleLogout } = useAuth();

  
  return (
    <nav className="flex flex-wrap justify-between lg:w-[100%] px-4 py-2">
      <div>
        <NavLink to="/" className="font-semibold text-2xl">
          Crypt Upwork
        </NavLink>
      </div>

      <div className="lg:w-[14rem] mx-2">
        <div className="flex gap-4 items-center justify-between">
          {isLoggedIn ? (
            <div>
              <NavLink to="profile" className="text-4xl">
                {" "}
                <Button type={"roundedS"}>
                  <HiMiniUserCircle />
                </Button>{" "}
              </NavLink>
              <Button type={"secondary"} onClickHandler={handleLogout}>
                logout
              </Button>
            </div>
          ) : (
            <NavLink to="login">
              <Button type={"secondary"}>login</Button>
            </NavLink>
          )}

          <Button type={"primary"}>connect wallet</Button>
        </div>
      </div>
    </nav>
  );
}
