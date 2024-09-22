import Avtar from "./Avtar"
import Login from "./Login"
import { ThemeToggle } from "./theme-toggle"
import { useAuth } from "@/contexts/AuthContext"

function Header() {
  const {authState, dispatch: dispatchAuthState} = useAuth() 

  return (
    <div className="flex justify-end items-center gap-x-6">
      <ThemeToggle />
      { authState.isLoggedIn?  <Avtar />: <Login />}


    </div>
  )
}

export default Header
