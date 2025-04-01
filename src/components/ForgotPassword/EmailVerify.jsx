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
import { toast } from "react-toastify";

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
        toast.error("รหัส OTP ไม่ถูกต้อง", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (error.response && error.response.status === 400) {
        toast.error("รหัส OTP หมดอายุ", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error("เกิดข้อผิดพลาด", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      {loading && (
        <div className="loader-overlay">
          <div className="loader">
            <i class="bx bx-loader-circle bx-spin bx-rotate-90"></i>
          </div>
        </div>
      )}
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <i className="bx bx-chevron-left" onClick={() => navigate(-1)}></i>
            <h2 className="text">ยืนยันอีเมล</h2>
          </div>

          <div className="email-text">
            <span>เราได้ส่งรหัส OTP ไปที่อีเมล</span> <span>{email}</span>
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
              <h4>ยืนยัน</h4>
            </button>
          </div>
        </div>
      </div>{" "}
    </>
  );
}

export default EmailVerify;
