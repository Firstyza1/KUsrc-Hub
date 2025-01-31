import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loginUser = (userData, token) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  useEffect(() => {
    const initializeUser = () => {
      const token = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("user");
      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser); 
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการแปลงข้อมูล user:", error);
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
