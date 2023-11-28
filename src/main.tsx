import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Register } from './pages/auth/register.tsx'
import { Home } from './Home.tsx'
import { StartupFull } from './pages/Startup/StartupFullView.tsx'
import { VoteResults } from './pages/VoteResults.tsx'
import { Login } from './pages/auth/Login.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/startup/:id",
        element: <StartupFull />
      }, {
        path: "/startup/results",
        element: <VoteResults />
      }
    ],
    errorElement: <h1>Something went wrong!</h1>
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
