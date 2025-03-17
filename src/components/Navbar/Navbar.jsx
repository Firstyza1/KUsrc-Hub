import React from "react";
import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/images/logo.png";
import Navuser from "./Navuser";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const location = useLocation();
  return (
    <header className="header">
      <div className="navbar-container">
        <div className="navbar-header">
          <div className="logo-container">
            <img className="logo-image" src={logo} alt="Logo" />
          </div>
          <nav className={isMenuOpen ? "navbar active" : "navbar"}>
            <div className="navbar-link" onClick={closeMenu}>
              <Link
                to="/Subjects"
                className={location.pathname === "/Subjects" ? "active" : ""}
              >
                รีวิวรายวิชา
              </Link>
              <Link
                to="/Community"
                className={location.pathname === "/Community" ? "active" : ""}
              >
                ชุมชน
              </Link>
              <Link to="/About">เกี่ยวกับเรา</Link>
              {/* <Link to="/Register">ลงทะเบียน</Link>
              <Link to="/Login">เข้าสู่ระบบ</Link> */}
            </div>
          </nav>
        </div>
        <div className="user-menu-navber">
          <Navuser />
        </div>
      </div>
      {/* <nav className={isMenuOpen ? "navbar active" : "navbar"}>
        {isMenuOpen ? (
          <>
            <div className="navbar-link" onClick={closeMenu}>
              <Link to="/Subjects">รีวิวรายวิชา</Link>
              <Link to="/Community">ชุมชน</Link>
              <Link to="/About">เกี่ยวกับเรา</Link>
              <Link to="/Register">ลงทะเบียน</Link>
              <Link to="/Login">เข้าสู่ระบบ</Link>
            </div>
          </>
        ) : (
          <>
            <div className="navbar-link" onClick={closeMenu}>
              <Link to="/Subjects">รีวิวรายวิชา</Link>
              <Link to="/Community">ชุมชน</Link>
              <Link to="/About">เกี่ยวกับเรา</Link>
            </div>
            <Navuser />
          </>
        )}
      </nav> */}
      <div className="navMoblie">
        <div className="navMenu" onClick={toggleMenu}>
          {isMenuOpen ? (
            <i className="bx bx-x"></i>
          ) : (
            <i className="bx bx-menu"></i>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
