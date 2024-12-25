import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

import Community from './components/Community.jsx';
import About from './components/About.jsx';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
const router = createBrowserRouter([
  {
    path:"/",
    element:<App/>
  },
  {
    path:"/Community",
    element:<Community/>
  },
  {
    path:"/About",
    element:<About/>
  },
  {
    path:"/Register",
    element:<Register/>
  },
  {
    path:"/Login",
    element:<Login/>
  },
]
)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
