import { ThemeProvider } from "./components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

import Header from "./components/Header"
import Home from "./pages/Home"

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="px-4 py-2">
        <Header />
        <Toaster/>
        <Home/>
      </div>
    </ThemeProvider>
  )
}

export default App
