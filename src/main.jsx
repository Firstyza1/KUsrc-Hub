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
import EditProfile from "./components/EditProfile/EditProfile.jsx";
import Profile from "./components/Profile/Profile.jsx";
import ManageUser from "./components/ManageUser/ManageUser.jsx";
import ManageSubject from "./components/ManageSubject/ManageSubject.jsx";
import ManagePost from "./components/ManagePost/ManagePost.jsx";
import EditProfileAdmin from "./components/EditProfileAdmin/EditProfileAdmin.jsx";
import CreateSubjectForm from "./components/CreateSubjectAdmin/CreateSubjectAdmin.jsx";
import EditSubjectAdmin from "./components/EditSubjectAdmin/EditSubjectAdmin.jsx";
import ManageReview from "./components/ManageReview/ManageReview.jsx";
import ManageReportReview from "./components/ManageReportReview/ManageReportReview.jsx";
import ManageReportPost from "./components/ManageReportPost/ManageReportPost.jsx";
import ManageReportComment from "./components/ManageReportComment/ManageReportComment.jsx";
import Dashboard from "./components/DashBoard/DashBoard.jsx";

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
  {
    path: "/EditProfile/:id",
    element: <EditProfile/>,
  },
  {
    path: "/Profile/:id",
    element: <Profile/>,
  },
  {
    path: "/ManageUser",
    element: <ManageUser/>,
  },
  {
    path: "/ManageSubject",
    element: <ManageSubject/>,
  },
  {
    path: "/ManagePost",
    element: <ManagePost/>,
  },
  {
    path: "/EditProfileAdmin/:id",
    element: <EditProfileAdmin/>,
  },
  {
    path: "/CreateSubject",
    element: <CreateSubjectForm/>,
  },
  {
    path: "/EditSubjectAdmin/:subject_id",
    element: <EditSubjectAdmin/>,
  },
  {
    path: "/ManageReview",
    element: <ManageReview/>,
  },
  {
    path: "/ManageReportReview",
    element: <ManageReportReview/>,
  },
  {
    path: "/ManageReportPost",
    element: <ManageReportPost/>,
  },
  {
    path: "/ManageReportComment",
    element: <ManageReportComment/>,
  },
  { path: "/Dashboard", element: <Dashboard/> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>
);
