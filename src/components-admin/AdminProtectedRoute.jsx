import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/UserContext/User";
import { toast } from "react-toastify";
import axios from "axios";

const AdminProtectedRoute = ({ children }) => {
  const { user, loading } = useUser(); // เปลี่ยนจาก loading เป็น loading (ตัวเล็ก)
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!loading) {
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
          return;
        }

        try {
          const response = await axios.get(
            "http://localhost:3000/verify-admin",
            {
              headers: {
                authtoken: `Bearer ${user?.token}`,
              },
            }
          );
          if (response.status === 200) {
            setIsAdmin(true);
          } else {
            toast.error("คุณไม่มีสิทธิ์เข้าถึงหน้านี้", {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            navigate("/");
          }
        } catch (error) {
          if (error.response?.status === 403) {
            toast.error("คุณไม่มีสิทธิ์เข้าถึงหน้านี้", {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            navigate("/");
          } else {
            toast.error("เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์", {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            navigate("/");
          }
        } finally {
          setIsChecking(false);
        }
      }
    };
    checkAdminStatus();
  }, [user, loading, navigate]);

  // if (loading || isChecking) {
  //   return <div>กำลังตรวจสอบสิทธิ์...</div>;
  // }

  if (!isAdmin) {
    return null;
  }

  return children;
};

export default AdminProtectedRoute;
