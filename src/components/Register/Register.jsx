import { React, useState } from "react";
import Navbar from "../Navbar/Navbar";
import "./Register.css";

function Register() {
  return (
    <>
      <Navbar />
      <div className="register-page">
        <div className="register-container">
          <div className="register-header">
            <div className="text">
              ลงทะเบียน<div className="underline"></div>
            </div>
          </div>
          <dev className="inputs">
            <div className="input">
              <i class="bx bxs-envelope"></i>
              <input type="text" placeholder="อีเมล" maxLength="40"></input>
            </div>
            <div className="input">
              <i class="bx bxs-user-circle"></i>
              <input type="text" placeholder="ชื่อผู้ใช้"></input>
            </div>{" "}
            <div className="input">
              <i class="bx bxs-lock-alt"></i>
              <input type="password" placeholder="รหัสผ่าน"></input>
            </div>{" "}
            <div className="input">
              <i class="bx bxs-lock-alt"></i>
              <input type="password" placeholder="ยืนยันรหัสผ่าน"></input>
            </div>
          </dev>
          <div className="submit-containter">
            <div className="submit">ลงทะเบียน</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
