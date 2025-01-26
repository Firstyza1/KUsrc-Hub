import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserProvider } from "./components/User"; // นำเข้า UserProvider
import App from "./App.jsx";
import Community from "./components/Community.jsx";
import About from "./components/About/About.jsx";
import Register from "./components/Register/Register.jsx";
import Login from "./components/Login/Login.jsx";
import ForgotPassword from "./components/Login/ForgotPassword.jsx";
import OTPpassword from "./components/Login/OTPpassword.jsx";
import RequestForm from "./components/RequestForm/RequestForm.jsx";

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
    path: "/OTPpassword",
    element: <OTPpassword />,
  },
  {
    path: "/Requestform",
    element: <RequestForm />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      {" "}
      {/* ครอบทุกอย่างด้วย UserProvider */}
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>
);
