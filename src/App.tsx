import { ThemeProvider } from "@/components/theme-provider"
import Test from "./components/Test"

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Test/>
    </ThemeProvider>
  )
}

export default App
