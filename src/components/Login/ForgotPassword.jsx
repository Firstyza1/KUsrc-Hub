import { React, useState } from "react";
import { useNavigate } from "react-router-dom";  // นำเข้า useNavigate
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import "./Login.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  
  const navigate = useNavigate();  

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      return "กรุณากรอกอีเมล";
    }
    if (!emailRegex.test(value)) {
      return "รูปแบบอีเมลไม่ถูกต้อง";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    if (emailError) {
      setErrorEmail(emailError);
      return;
    }

    localStorage.setItem("email", email);
    navigate("/OTPpassword");  
  };

  return (
    <>
      <Navbar />
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <div className="text">
              ลืมรหัสผ่าน<div className="underline"></div>
            </div>
          </div>
          <div className="login-inputs">
            <div className="email-input">
              <div className="login-input">
                <i className="bx bxs-envelope"></i>
                <input
                  type="text"
                  placeholder="อีเมล"
                  maxLength="40"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></input>
              </div>
              {errorEmail && <div className="error">{errorEmail}</div>}
            </div>
          </div>
          <div className="submit-container">
            <div className="submit" onClick={handleSubmit}>
              ถัดไป
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
