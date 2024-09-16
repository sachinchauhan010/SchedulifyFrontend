import { ThemeProvider } from "./components/theme-provider"

import Header from "./components/Header"

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="px-4 py-2">
        <Header />
      </div>
    </ThemeProvider>
  )
}

export default App
