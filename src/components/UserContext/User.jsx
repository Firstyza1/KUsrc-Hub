import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loginUser = (userData, token) => {
    const userWithToken = { ...userData, token }; // เพิ่ม token เข้าไปใน userData
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(userWithToken));
    setUser(userWithToken);
  };

  const logoutUser = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login"; // ใช้ window.location.href สำหรับการ redirect
  };

  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          // ตรวจสอบโทเค็นกับเซิร์ฟเวอร์
          const response = await axios.get(
            "http://localhost:3000/verify-token",
            {
              headers: {
                authtoken: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 200) {
            const parsedUser = JSON.parse(storedUser);
            parsedUser.token = token;
            setUser(parsedUser);
          } else {
            logoutUser();
          }
        } catch (error) {
          if (error.response && error.response.status === 401) {
            toast.error("หมดเวลาการเชื่อมต่อ", {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setTimeout(() => {
              logoutUser();
            }, 1500);
          } else {
            toast.error("เกิดข้อผิดพลาด", {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setTimeout(() => {
              logoutUser();
            }, 1500);
          }
          logoutUser();
        }
      }
      setLoading(false);
    };

    initializeUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, loading, setUser, logoutUser, loginUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
