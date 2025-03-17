import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { useUser } from "../User";

const Navuser = () => {
  const { user, loading, logoutUser } = useUser();
  const [activePopup, setActivePopup] = useState(false);
  const closeMenu = () => setActivePopup(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                <div className="user-nav-info">
                  <div className="user-nav-header">
                    <h4 className="user-nav-username">{user.username}</h4>
                    <i
                      className="bx bx-x"
                      onClick={() => setActivePopup(!activePopup)}
                    ></i>
                  </div>

                  <img className="user-profile-info" src={user.user_profile} />
                  <p className="user-nav-email">{user.email}</p>
                  <p className="user-info-item">เข้าร่วม: {user.created_at}</p>
                </div>
                <ul>
                  <Link
                    className="user-menu-item"
                    to={`/Profile/${user.user_id}`}
                  >
                    <i className="bx bx-user-circle"></i>
                    <p>แก้ไขโปรไฟล์</p>
                  </Link>
                  <li className="user-menu-item" onClick={logoutUser}>
                    <i className="bx bx-log-out-circle"></i>
                    <p>ลงชื่อออก</p>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <Link className="register-button" to="/Register">
            ลงทะเบียน
          </Link>
          <Link className="login-button" to="/Login">
            เข้าสู่ระบบ
          </Link>
        </>
      )}
    </div>
  );
};

export default Navuser;
