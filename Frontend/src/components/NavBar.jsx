import { NavLink } from "react-router-dom";
import { HiMiniUserCircle } from "react-icons/hi2";
import LoginPage from "../pages/LoginPage";
import Button from "../ui/Button";

export default function NavBar({isLoggedIn}) {
  return (
    <nav className="flex flex-wrap justify-between lg:w-[100%] px-4 py-2">
        <div> 
            <NavLink to='/' className='text-2xl font-semibold'>Crypt Upwork</NavLink>
        </div>

        <div className="lg:w-[14rem] mx-2">
            <div className="flex gap-4 items-center justify-between">
                {isLoggedIn ? <NavLink to='profile' className='text-4xl '> <Button type={'roundedS'}>
                  <HiMiniUserCircle />
                  </Button>  </NavLink>
                : <NavLink to='login' >
                  <Button type={'secondary'} >login</Button>
                </NavLink> }
                
            
                <Button type={'primary'}>
                  connect wallet
                </Button>
            </div>
        </div>
    </nav>
  )
}