import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserProvider } from "./components/User";
import { QueryClient, QueryClientProvider } from "react-query"; // Import QueryClient and QueryClientProvider

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
import ReviewPopup from "./components/Subjects/ReviewPopup.jsx";
import Editprofile from "./components/Profile/EditProfile.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Review from "./components/Subjects/Review.jsx";
import Navuser from "./components/Navbar/Navuser.jsx";
import PostPopup from "./components/Community/PostPopup.jsx";
import Report from "./components/Popup/Report.jsx";
import Post from "./components/Community/Post.jsx";
import Comment from "./components/Community/Comment.jsx";
import DeleteConfirmationPopup from "./components/Popup/DeleteConfirmationPopup.jsx";
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
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </QueryClientProvider>
  </StrictMode>
);
