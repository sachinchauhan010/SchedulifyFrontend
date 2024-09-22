import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider"
import { AuthProvider } from "./contexts/AuthContext"

import App from './App.tsx'
import './index.css'
import ErrorPage from './components/ErrorPage.tsx'
import About from './pages/About.tsx'
import ScheduleTable from './components/ScheduleTable.tsx';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';

const AppLayout = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Header />
        <Outlet />
        <Footer />
      </AuthProvider>
    </ThemeProvider>
  )
}


const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/schedule",
        element: <ScheduleTable />,
      },
      {
        path: "/about",
        element: <About />,
      },
    ],
    errorElement: <ErrorPage />,
  },
]);


const root = createRoot(document.getElementById("root")!)
root.render(<RouterProvider router={appRouter} />)
