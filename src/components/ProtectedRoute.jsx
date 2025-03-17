// ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "./User"; // ปรับ path ตามที่คุณเก็บ Context ไว้

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  const location = useLocation();

  if (loading) {
    // แสดง loading state ถ้ากำลังเช็คสถานะผู้ใช้
    return <div>Loading...</div>;
  }

  if (!user) {
    alert("กรุณาเข้าสู่ระบบก่อนใช้งาน");
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
