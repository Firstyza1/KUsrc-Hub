import { React, useState } from "react";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import "./Register";
import { otpFormSchema } from "../YupValidation/Validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";

function RegisterVerify() {
  const location = useLocation();
  const { email, password, username } = location.state || {};
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
      const response = await axios.post("http://localhost:3000/register", {
        email: email,
        username: username,
        password: password,
        otp: data.otp,
      });
      toast.success("สมัครสมาชิกสำเร็จ", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate("/login");
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
      <div className="login-page">
        <div className="register-container">
          <div className="login-header">
            <i className="bx bx-chevron-left" onClick={() => navigate(-1)}></i>
            <h2 className="text">ยืนยันอีเมล</h2>
          </div>
          <div className="email-text">
            <span>เราได้ส่งรหัส OTP ไปที่อีเมล</span> <span>{email}</span>
          </div>
          <div className="register-inputs">
            <div className="otp-input">
              <div className="register-input">
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
      </div>
    </>
  );
}

export default RegisterVerify;
