import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

import Community from './components/Community.jsx';
import About from './components/About.jsx';
import Register from './components/Register/Register.jsx';
import Login from './components/Login/Login.jsx';
import RequestForm from './components/RequestForm/RequestForm.jsx';
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
  {
    path:"/Requestform",
    element:<RequestForm/>
  },
]
)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
