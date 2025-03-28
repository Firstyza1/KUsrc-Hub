import React, { useState } from "react";
import "./Sidebar.css";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/images/logoAdmin.png";
import PageTitle from "./PageTitle";
import {Flag} from "lucide-react";
function SideBar() {
  const [isOpen, setIsOpen] = useState(false); // State ควบคุม Sidebar
  const location = useLocation(); // ใช้ useLocation เพื่อดึง path ปัจจุบัน

  // ฟังก์ชันเพื่อกำหนดชื่อหน้าจาก path
  const getPageTitle = (path) => {
    switch (path) {
      case "/Dashboard":
        return "แดชบอร์ด";
      case "/ManageUser":
        return "จัดการผู้ใช้";
      case "/ManageSubject":
        return "จัดการรายวิชา";
      case "/ManagePost":
        return "จัดการโพสต์";
      case "/ManageReview":
        return "จัดการรีวิว";
      case "/ManageReportReview":
        return "จัดการรายงานรีวิว";
      case "/ManageReportPost":
        return "จัดการรายงานโพสต์";
      case "/ManageReportComment":
        return "จัดการรายงานความคิดเห็น";
      default:
        return "";
    }
  };
  return (
    <>
      <PageTitle pageTitle={getPageTitle(location.pathname)} />

      <div
        className={`sidebar-container ${isOpen ? "open" : ""}`}
        // onMouseEnter={() => setIsOpen(true)} // ✅ เปิด Sidebar เมื่อ Hover
        // onMouseLeave={() => setIsOpen(false)} // ✅ ปิด Sidebar เมื่อเมาส์ออก
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* ✅ โลโก้ของ Sidebar */}
        <div
          className="logo-container-admin"
          onClick={() => setIsOpen(!isOpen)}
          style={{ cursor: "pointer" }}
        >
          <img src={logo} alt="Logo" className="logo" />
          {/* เปลี่ยน path เป็นรูปของคุณ */}
        </div>

        {/* เมนู Sidebar */}
        <div className="sidebar-link">
          {/* <NavLink
            to="/Subjects"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <i className="bx bx-home"></i>
            <span>เว็บไซต์หลัก</span>
          </NavLink> */}
          <NavLink
            to="/Dashboard"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <i className="bx bxs-dashboard"></i>
            <span>แดชบอร์ด</span>
          </NavLink>
          <NavLink
            to="/ManageUser"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <i className="bx bx-user"></i> <span>จัดการผู้ใช้</span>
          </NavLink>
          <NavLink
            to="/ManageSubject"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <i className="bx bx-book"></i> <span>จัดการรายวิชา</span>
          </NavLink>
          <NavLink
            to="/ManagePost"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <i className="bx bx-send"></i> <span>จัดการโพสต์</span>
          </NavLink>
          <NavLink
            to="/ManageReview"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <i className='bx bx-comment-dots'></i> <span>จัดการรีวิว</span>
          </NavLink>
          <NavLink
            to="/ManageReportReview"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <i className="bx bx-error"></i> <span>จัดการรายงานรีวิว</span>
          </NavLink>
          <NavLink
            to="/ManageReportPost"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <i className='bx bx-flag'></i> <span>จัดการรายงานโพสต์</span>
          </NavLink>
          <NavLink
            to="/ManageReportComment"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <i className='bx bx-comment-error'></i>{" "}
            <span>จัดการรายงานความคิดเห็น</span>
          </NavLink>
        </div>
      </div>
    </>
  );
}

export default SideBar;