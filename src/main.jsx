import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserProvider } from "./components/User"; 
import App from "./App.jsx";
import Community from "./components/Community.jsx";
import About from "./components/About/About.jsx";
import Register from "./components/Register/Register.jsx";
import Login from "./components/Login/Login.jsx";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword.jsx";
import EmailVerify from "./components/ForgotPassword/EmailVerify.jsx";
import RequestForm from "./components/RequestForm/RequestForm.jsx";
import ResetPassword from "./components/ForgotPassword/ResetPassword.jsx";
import RegisterVerify from "./components/Register/RegisterVerify.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/Community",
    element: <Community />,
  },
  {
    path: "/About",
    element: <About />,
  },
  {
    path: "/Register",
    element: <Register />,
  },
  {
    path: "/Login",
    element: <Login />,
  },
  {
    path: "/ForgotPassword",
    element: <ForgotPassword />,
  },
  {
    path: "/EmailVerify",
    element: <EmailVerify />,
  },
  {
    path: "/ResetPassword",
    element: <ResetPassword  />,
  },
  {
    path: "/Requestform",
    element: <RequestForm />,
  },
  {
    path: "/RegisterVerify",
    element: <RegisterVerify />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>
);
