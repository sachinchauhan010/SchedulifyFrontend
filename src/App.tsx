import { ThemeProvider } from "./components/theme-provider"
import { AuthProvider } from "./contexts/AuthContext"
import Header from "./components/Header"
import Home from "./pages/Home"
import { Toaster } from "@/components/ui/toaster"


function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <div className="px-4 py-2">
          <Header />
          <Toaster />
          <Home />
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
