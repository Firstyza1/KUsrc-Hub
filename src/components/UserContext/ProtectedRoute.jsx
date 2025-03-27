// ProtectedRoute.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "./User"; // ปรับ path ตามที่คุณเก็บ Context ไว้
import { toast } from "react-toastify";
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  if (loading) {
    // แสดง loading state ถ้ากำลังเช็คสถานะผู้ใช้
    return <div>Loading...</div>;
  }

  if (!user) {
    toast.error("กรุณาเข้าสู่ระบบก่อนเข้าถึงหน้านี้", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    navigate("/Login");
    // alert("กรุณาเข้าสู่ระบบก่อนใช้งาน");
    // return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
