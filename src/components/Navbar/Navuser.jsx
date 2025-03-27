import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { useUser } from "../UserContext/User";
import { useNavigate } from "react-router-dom";
const Navuser = () => {
  const { user, loading, logoutUser } = useUser();
  const [activePopup, setActivePopup] = useState(false);
  const closeMenu = () => setActivePopup(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        event.target.closest(".user-menu") === null &&
        event.target.closest(".user-username") === null
      ) {
        setActivePopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const formatFullDate = (dateString) => {
    const date = new Date(dateString); // แปลงวันที่สร้างโพสต์เป็น Date object
    const thaiDays = [
      "อาทิตย์",
      "จันทร์",
      "อังคาร",
      "พุธ",
      "พฤหัสบดี",
      "ศุกร์",
      "เสาร์",
    ];
    const thaiMonths = [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ];

    const dayOfWeek = thaiDays[date.getDay()]; // วันในสัปดาห์ (อาทิตย์-เสาร์)
    const day = date.getDate(); // วันที่ (1-31)
    const month = thaiMonths[date.getMonth()]; // เดือน (ม.ค.-ธ.ค.)
    const year = date.getFullYear() + 543; // ปี พ.ศ.
    return `${day} ${month} ${year}`;
  };
  return (
    <div className="navbar-button">
      {loading ? (
        <div className="loading-placeholder">กำลังโหลด...</div>
      ) : user ? (
        <>
          <div className="user-navbar">
            <div
              className="user-username"
              onClick={() => setActivePopup(!activePopup)}
            >
              <img className="user-profile" src={user.user_profile} />
              <div>
                <h4>{user.username}</h4>
                <p>{user.email}</p>
              </div>
            </div>
            {activePopup === true && (
              <div className="user-menu">
                <div className="user-nav-header">
                  <h4 className="user-nav-username">{user.username}</h4>
                  <i
                    className="bx bx-x"
                    onClick={() => setActivePopup(!activePopup)}
                  ></i>
                </div>
                <div className={`user-nav-container ${user?.role === "admin" ? "admin" : ""}`}>
                  <div className="user-nav-info">
                    <img
                      className="user-profile-info"
                      src={user.user_profile}
                    />
                    <p className="user-nav-email">{user.email}</p>
                    <p className="user-info-item">
                      เข้าร่วม: {formatFullDate(user.created_at)}
                    </p>
                  </div>
                  <ul>
                    {user?.role === "admin" && (
                      <li
                        className="user-menu-item"
                        onClick={() => navigate(`/Dashboard`)}
                      >
                        <i className="bx bx-data"></i>

                        <p>จัดการข้อมูล</p>
                      </li>
                    )}
                    <li
                      className="user-menu-item"
                      onClick={() => navigate(`/Profile/${user.user_id}`)}
                    >
                      <i className="bx bx-user-circle"></i>

                      <p>แก้ไขโปรไฟล์</p>
                    </li>
                    <li className="user-menu-item" onClick={logoutUser}>
                      <i className="bx bx-log-out-circle"></i>
                      <p>ลงชื่อออก</p>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div
            className="register-button"
            onClick={() => navigate("/Register")}
          >
            ลงทะเบียน
          </div>
          <div className="login-button" onClick={() => navigate("/Login")}>
            เข้าสู่ระบบ
          </div>
        </>
      )}
    </div>
  );
};

export default Navuser;
