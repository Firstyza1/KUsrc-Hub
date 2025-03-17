import React, { useState } from "react";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import logo from "../../assets/images/logo.png";
function SideBar() {
  const [isOpen, setIsOpen] = useState(false); // State ควบคุม Sidebar

  return (
    <div
      className={`sidebar-container ${isOpen ? "open" : ""}`}
      onMouseEnter={() => setIsOpen(true)}  // ✅ เปิด Sidebar เมื่อ Hover
      onMouseLeave={() => setIsOpen(false)} // ✅ ปิด Sidebar เมื่อเมาส์ออก
    >
      {/* ✅ โลโก้ของ Sidebar */}
      <div className="logo-container-admin">
        <img src={logo} alt="Logo" className="logo" /> {/* เปลี่ยน path เป็นรูปของคุณ */}
      </div>

      {/* เมนู Sidebar */}
      <div className="sidebar-link">
        <NavLink to="/ManageUser" className={({ isActive }) => isActive ? "active-link" : ""}>
          <i className="bx bx-user"></i> <span>จัดการผู้ใช้</span>
        </NavLink>
        <NavLink to="/ManageSubject" className={({ isActive }) => isActive ? "active-link" : ""}>
          <i className="bx bx-book"></i> <span>จัดการรายวิชา</span>
        </NavLink>
        <NavLink to="/ManagePost" className={({ isActive }) => isActive ? "active-link" : ""}>
          <i className="bx bx-send"></i> <span>จัดการโพสต์</span>
        </NavLink>
        <NavLink to="/ManageReview" className={({ isActive }) => isActive ? "active-link" : ""}>
          <i className="bx bx-message"></i> <span>จัดการรีวิว</span>
        </NavLink>
        <NavLink to="/ManageReportReview" className={({ isActive }) => isActive ? "active-link" : ""}>
          <i className="bx bx-task-x"></i> <span>จัดการคำร้องรีวิว</span>
        </NavLink>
        <NavLink to="/ManageReportPost" className={({ isActive }) => isActive ? "active-link" : ""}>
          <i className="bx bx-task-x"></i> <span>จัดการคำร้องโพสต์</span>
        </NavLink>
        <NavLink to="/ManageReportComment" className={({ isActive }) => isActive ? "active-link" : ""}>
          <i className="bx bx-task-x"></i> <span>จัดการคำร้องความคิดเห็น</span>
        </NavLink>
      </div>
    </div>
  );
}

export default SideBar;
