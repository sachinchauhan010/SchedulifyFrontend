import { useEffect } from "react"
import Avtar from "./Profile/Avtar"
import Login from "./Home/Login"
import { ThemeToggle } from "./Theme/theme-toggle"
import { useAuth } from "@/contexts/AuthContext"
import { useCheckAuth } from "@/hooks/use-check-auth"
import { Link } from "react-router-dom"

function Header() {
  const { authState, dispatch: authStateDispatch } = useAuth() //auth state global store

  async function checkAuth() {
    const authStatus: any = await useCheckAuth()
    authStatus.success ? authStateDispatch({ type: "LOGIN", payload: { name: authStatus?.name } }) : authStateDispatch({ type: "LOGOUT" })
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <div className="flex justify-between items-center">

      <Link to={"/"} className="text-xl font-semibold"><span className="text-[#03dac5]">T</span>rack<span className="text-[#03dac5]">M</span>Y<span className="text-[#03dac5]">C</span>lass</Link>
      <div className="flex justify-end items-center gap-x-6">
        <ThemeToggle />
        {authState.isLoggedIn ? <Avtar /> : <Login />}
      </div>
    </div>
  )
}

export default Header
