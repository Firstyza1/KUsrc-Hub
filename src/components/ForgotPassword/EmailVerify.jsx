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
        alert("รหัส OTP ไม่ถูกต้อง");
      } else if (error.response && error.response.status === 400) {
        alert("รหัส OTP หมดอายุ");
      } else {
        alert("เกิดข้อผิดพลาด");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-page">
        <div className="login-container">
          <div className="login-header" onClick={() => navigate(-1)}>
            <i className="bx bx-chevron-left"></i>
            <h2 className="text">ยืนยันอีเมล</h2>
          </div>

          <div className="email-text">
            <p>เราได้ส่งรหัส OTP ไปที่อีเมล</p> <p>{email}</p>
          </div>
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
              {loading ? (
                <ClipLoader color={"#ffffff"} size={18} />
              ) : (
                <h4>ยืนยัน</h4>
              )}
            </button>
          </div>
        </div>
      </div>{" "}
    </>
  );
}

export default EmailVerify;
