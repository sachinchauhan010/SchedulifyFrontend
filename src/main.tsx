import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider"
import { AuthProvider } from "./contexts/AuthContext"

import App from './App.tsx'
import './index.css'
import ErrorPage from './components/ErrorPage.tsx'
import About from './pages/About.tsx'
import ScheduleTable from './components/ScheduleTable.tsx';

const appRouter = createBrowserRouter([
  {
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


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <div className='px-6 py-2'>
        <RouterProvider router={appRouter} />
        </div>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
