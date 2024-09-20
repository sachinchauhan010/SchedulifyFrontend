import Avtar from "./Avtar"
import Login from "./Login"
import { ThemeToggle } from "./theme-toggle"

function Header() {
  return (
    <div className="flex justify-end items-center gap-x-6">
      <ThemeToggle/>
      <Login/>
      <Avtar/>
    </div>
  )
}

export default Header
