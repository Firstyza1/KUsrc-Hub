import { React, useState } from "react";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import "../Login/Login.css";
import { otpFormSchema } from "../YupValidation/Validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

function EmailVerify() {
  const location = useLocation();
  const { email } = location.state || {};
  const [error, setError] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    resolver: yupResolver(otpFormSchema),
    reValidateMode: "onSubmit",
  });

  const onSubmit = async (data) => {
    console.log(data);
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/verifyOTP", {
        email: email,
        otp: data.otp,
      });
      navigate("/ResetPassword", { state: { email: email } });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("รหัส OTP ไม่ถูกต้อง");
        setShowErrorPopup(true);
      } else if (error.response && error.response.status === 400) {
        setError("รหัส OTP หมดอายุ");
        setShowErrorPopup(true);
      } else {
        setError("เกิดข้อผิดพลาด");
        setShowErrorPopup(true);
      }
    } finally {
      setLoading(false);
    }
  };
  const closePopup = () => {
    setShowErrorPopup(false);
  };

  return (
    <>
      <Navbar />
      <div className="login-page">
        <div className="login-container">
          <div className="icon" onClick={() => navigate(-1)}>
            <i className="bx bx-chevron-left"></i>
          </div>
          <div className="login-header">
            <div className="text">
              ยืนยันอีเมล<div className="underline"></div>
            </div>
          </div>
          <div className="email-text">เราได้ส่งรหัส OTP ไปที่อีเมล {email}</div>
          <div className="login-inputs">
            <div className="otp-input">
              <div className="login-input">
                <i className="bx bxs-lock-alt"></i>
                <input
                  type="text"
                  placeholder="กรุณากรอกรหัส OTP 6 หลัก"
                  maxLength="6"
                  {...register("otp")}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                ></input>
              </div>
              {errors.otp && (
                <div className="text-error">{errors.otp.message}</div>
              )}
            </div>
          </div>
          <div className="submit-container">
            <button
              className="submit"
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
            >
              {loading ? <ClipLoader color={"#ffffff"} size={18} /> : "ยืนยัน"}
            </button>
          </div>
        </div>
      </div>{" "}
      {showErrorPopup && (
        <div className="error-popup">
          <div className="popup-content">
            <p>{error}</p>
            <button onClick={closePopup}>ปิด</button>
          </div>
        </div>
      )}
    </>
  );
}

export default EmailVerify;
