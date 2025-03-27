import React from "react";
import "./Navbar.css";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/images/logo.png";
import Navuser from "./Navuser";
import { useUser } from "../UserContext/User";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const location = useLocation();
  const { user } = useUser();
  return (
    <header className="header">
      <div className="navbar-container">
        <div className="navbar-header">
          <div className="logo-container">
            <img className="logo-image" src={logo} alt="Logo" />
          </div>
          <nav className={isMenuOpen ? "navbar active" : "navbar"}>
            <div className="navbar-link" onClick={closeMenu}>
              <NavLink
                to="/Subjects"
                className={location.pathname === "/Subjects" ? "active" : ""}
              >
                รีวิวรายวิชา
              </NavLink>
              <NavLink
                to="/Community"
                className={location.pathname === "/Community" ? "active" : ""}
              >
                ชุมชน
              </NavLink>
              {/* {user?.role === "admin" && (
                <NavLink
                  to="/Dashboard"
                  className={location.pathname === "/Dashboard" ? "active" : ""}
                >
                  จัดการข้อมูล
                </NavLink>
              )} */}

              {/* <NavLink to="/About">เกี่ยวกับเรา</NavLink> */}
              {/* <NavLink to="/Register">ลงทะเบียน</NavLink>
              <NavLink to="/Login">เข้าสู่ระบบ</NavLink> */}
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
            <div className="navbar-NavLink" onClick={closeMenu}>
              <NavLink to="/Subjects">รีวิวรายวิชา</NavLink>
              <NavLink to="/Community">ชุมชน</NavLink>
              <NavLink to="/About">เกี่ยวกับเรา</NavLink>
              <NavLink to="/Register">ลงทะเบียน</NavLink>
              <NavLink to="/Login">เข้าสู่ระบบ</NavLink>
            </div>
          </>
        ) : (
          <>
            <div className="navbar-NavLink" onClick={closeMenu}>
              <NavLink to="/Subjects">รีวิวรายวิชา</NavLink>
              <NavLink to="/Community">ชุมชน</NavLink>
              <NavLink to="/About">เกี่ยวกับเรา</NavLink>
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
