import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../User";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const { user, loading, logoutUser } = useUser();

  return (
    <header className="header">
      <div className="logo-container">
        <img
          className="logo-image"
          src="src/assets/images/logo.png"
          alt="Logo"
        />
      </div>
      <nav className={isMenuOpen ? "navbar active" : "navbar"}>
        {isMenuOpen ? (
          <>
            <div className="navbar-link" onClick={closeMenu}>
              <Link to="/">รีวิวรายวิชา</Link>
              <Link to="/Community">ชุมชน</Link>
              <Link to="/About">เกี่ยวกับเรา</Link>
              <Link to="/Register">ลงทะเบียน</Link>
              <Link to="/Login">เข้าสู่ระบบ</Link>
            </div>
          </>
        ) : (
          <>
            <div className="navbar-link" onClick={closeMenu}>
              <Link to="/">รีวิวรายวิชา</Link>
              <Link to="/Community">ชุมชน</Link>
              <Link to="/About">เกี่ยวกับเรา</Link>
            </div>

            <div className="navbar-button" onClick={closeMenu}>
              {!loading && (
                <>
                  {user ? (
                    <>
                      <a className="notification" href="#">
                        <i className="bx bxs-bell"></i>
                      </a>
                      <span>{user.email}</span>
                      <i className="bx bx-log-out" onClick={logoutUser}></i>
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
                </>
              )}
            </div>
          </>
        )}
      </nav>
      <div className="navMoblie">
        <div className="notification-btn" href="#">
          <i className="bx bxs-bell"></i>
        </div>
        <div className="navMenu" onClick={toggleMenu}>
          {isMenuOpen ? <i class="bx bx-x"></i> : <i class="bx bx-menu"></i>}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
