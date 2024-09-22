import Footer from "./components/Footer"
import Header from "./components/Header"
import Home from "./pages/Home"
import { Toaster } from "@/components/ui/toaster"


function App() {
  return (

    <div>
      <Header />
      <Toaster />
      <Home />
      <Footer />
    </div>
  )
}

export default App
