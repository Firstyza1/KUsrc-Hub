import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserProvider } from "./components/UserContext/User.jsx";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify"; // นำเข้า ToastContainer
import "react-toastify/dist/ReactToastify.css"; // นำเข้า CSS ของ ToastContainer

import App from "./App.jsx";
import Community from "./components/Community/Community.jsx";
import About from "./components/About/About.jsx";
import Register from "./components/Register/Register.jsx";
import Login from "./components/Login/Login.jsx";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword.jsx";
import EmailVerify from "./components/ForgotPassword/EmailVerify.jsx";
import RequestForm from "./components/RequestForm/RequestForm.jsx";
import ResetPassword from "./components/ForgotPassword/ResetPassword.jsx";
import RegisterVerify from "./components/Register/RegisterVerify.jsx";
import Subjects from "./components/Subjects/Subjects.jsx";
import SubjectDetails from "./components/Subjects/SubjectDetails.jsx";
import StatCard from "./components-admin/DashBoard/StatCard.jsx";
import ReviewPopup from "./components/Subjects/ReviewPopup.jsx";
import Editprofile from "./components/Profile/EditProfile.jsx";
import ProtectedRoute from "./components/UserContext/ProtectedRoute.jsx";
import Review from "./components/Subjects/Review.jsx";
import Navuser from "./components/Navbar/Navuser.jsx";
import PostPopup from "./components/Community/PostPopup.jsx";
import Report from "./components/Popup/Report.jsx";
import Post from "./components/Community/Post.jsx";
import Comment from "./components/Community/Comment.jsx";
import DeleteConfirmationPopup from "./components/Popup/DeleteConfirmationPopup.jsx";
import PopupLogin from "./components/Popup/PopupLogin.jsx";
//admin
import ManageUser from "./components-admin/ManageUser/ManageUser.jsx";
import ManageSubject from "./components-admin/ManageSubject/ManageSubject.jsx";
import ManagePost from "./components-admin/ManagePost/ManagePost.jsx";
import SubjectForm from "./components-admin/CreateSubjectAdmin/CreateSubjectAdmin.jsx";
import ManageReview from "./components-admin/ManageReview/ManageReview.jsx";
import ManageReportReview from "./components-admin/ManageReportReview/ManageReportReview.jsx";
import ManageReportPost from "./components-admin/ManageReportPost/ManageReportPost.jsx";
import ManageReportComment from "./components-admin/ManageReportComment/ManageReportComment.jsx";
import Dashboard from "./components-admin/DashBoard/DashBoard.jsx";
///
import DeletePopup from "./components-admin/DeletePopup/DeletePopup.jsx";
import PageTitle from "./components-admin/SideBar/PageTitle.jsx";
import AdminProtectedRoute from "./components-admin/AdminProtectedRoute.jsx";
import NavuserAdmin from "./components/Navbar/NavuserAdmin.jsx";
// Create a new QueryClient instance
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/DeleteConfirmationPopup",
    element: <DeleteConfirmationPopup />,
  },
  {
    path: "/Navuser",
    element: <Navuser />,
  },
  {
    path: "/Review",
    element: <Review />,
  },
  {
    path: "/PostPopup",
    element: <PostPopup />,
  },
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
    element: <ResetPassword />,
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
    path: "/Subjects",
    element: <Subjects />,
  },
  {
    path: "/Subjects/:subject_id",
    element: <SubjectDetails />,
  },
  {
    path: "/StatCard/",
    element: <StatCard />,
  },

  {
    path: "/Post/:post_id",
    element: <Post />,
  },
  {
    path: "/Review",
    element: <ReviewPopup />,
  },
  {
    path: "/Report",
    element: <Report />,
  },
  {
    path: "/Comment",
    element: <Comment />,
  },
  {
    path: "/Profile/:id",
    element: (
      <ProtectedRoute>
        <Editprofile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/PopupLogin",
    element: <PopupLogin />,
  },

  //admin
  {
    path: "/ManageUser",
    element: (
      <AdminProtectedRoute>
        <ManageUser />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/ManageSubject",
    element: (
      <AdminProtectedRoute>
        <ManageSubject />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/ManagePost",
    element: (
      <AdminProtectedRoute>
        <ManagePost />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/SubjectForm",
    element: (
      <AdminProtectedRoute>
        <SubjectForm />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/ManageReview",
    element: (
      <AdminProtectedRoute>
        <ManageReview />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/ManageReportReview",
    element: (
      <AdminProtectedRoute>
        <ManageReportReview />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/ManageReportPost",
    element: (
      <AdminProtectedRoute>
        <ManageReportPost />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/ManageReportComment",
    element: (
      <AdminProtectedRoute>
        <ManageReportComment />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/Dashboard",
    element: (
      <AdminProtectedRoute>
        <Dashboard />
      </AdminProtectedRoute>
    ),
  },
  ///
  {
    path: "/DeletePopup",
    element: (
      <AdminProtectedRoute>
        <DeletePopup />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/PageTitle",
    element: (
      <AdminProtectedRoute>
        <PageTitle />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/NavuserAdmin",
    element: <NavuserAdmin />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <RouterProvider router={router} />
        <ToastContainer /> {/* เพิ่ม ToastContainer ที่นี่ */}
      </UserProvider>
    </QueryClientProvider>
  </StrictMode>
);
