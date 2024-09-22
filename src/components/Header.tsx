import Avtar from "./Avtar"
import Login from "./Login"
import { ThemeToggle } from "./theme-toggle"
import { useAuth } from "@/contexts/AuthContext"

function Header() {
  const { authState } = useAuth()

  return (
    <div className="flex justify-between items-center">

      <p className="text-xl font-semibold"><span className="text-[#03dac5]">T</span>rack<span className="text-[#03dac5]">M</span>Y<span className="text-[#03dac5]">C</span>lass</p>
      <div className="flex justify-end items-center gap-x-6">
        <ThemeToggle />
        {authState.isLoggedIn ? <Avtar /> : <Login />}
      </div>
    </div>
  )
}

export default Header
