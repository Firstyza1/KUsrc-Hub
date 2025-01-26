import { React, useState } from "react";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import "./Login.css";

function OTPpassword() {
  const [otp, setOtp] = useState("");

  const OTPinputChange = (e) => {
    const input = e.target.value;
    if (/^\d*$/.test(input) && input.length <= 6) {
      setOtp(input);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <div className="text">
            ตรวจสอบรหัส OTP<div className="underline"></div>
            </div>
          </div>
          <div className="login-inputs">
            <div className="login-input">
              <i className="bx bxs-lock-alt"></i>
              <input
                type="text"
                placeholder="กรุณากรอกรหัส OTP"
                maxLength="6"
                value={otp}
                onChange={OTPinputChange}
              ></input>
            </div>
            {/* {errorEmail && <div className="error">{errorEmail}</div>} */}
          </div>
          <div className="submit-container">
            <div className="submit">ยืนยัน</div>
            {/* <div className="submit" onClick={handleSubmit}>ถัดไป</div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default OTPpassword;
