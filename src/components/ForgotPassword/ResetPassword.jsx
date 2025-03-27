import { React, useState } from "react";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import "../Login/Login.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { PasswordFormSchema } from "../YupValidation/Validation";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConPassword, setshowConPassword] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    resolver: yupResolver(PasswordFormSchema),
    reValidateMode: "onSubmit",
  });

  const onSubmit = async (data) => {
    console.log(data);
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/resetPassword", {
        email: email,
        newPassword: data.confirmPassword,
      });
      toast.success("เปลี่ยนรหัสผ่านสำเร็จ", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // localStorage.removeItem("email");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <i className="bx bx-chevron-left" onClick={() => navigate(-1)}></i>
            <h2 className="text">เปลี่ยนรหัสผ่าน</h2>
          </div>
          {/* <div className="login-header">
            <h2 className="text">เปลี่ยนรหัสผ่าน</h2>
          </div> */}
          <div className="email-text">
            <span>กรุณาใส่รหัสผ่านใหม่สำหรับอีเมล</span>
            <span>{email}</span>
          </div>
          <div className="login-inputs">
            <div className="password-input">
              <div className="login-input">
                <i className="bx bxs-lock-alt"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="รหัสผ่าน"
                  {...register("password")}
                ></input>
                <i
                  className={showPassword ? "bx bx-show" : " bx bx-hide"}
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer", margin: 0 }}
                ></i>
              </div>
              {errors.password && (
                <div className="text-error">{errors.password.message}</div>
              )}
            </div>
            <div className="password-input">
              <div className="login-input">
                <i className="bx bxs-lock-alt"></i>
                <input
                  type={showConPassword ? "text" : "password"}
                  placeholder="ยืนยันรหัสผ่าน"
                  {...register("confirmPassword")}
                ></input>{" "}
                <i
                  className={showConPassword ? "bx bx-show" : " bx bx-hide"}
                  onClick={() => setshowConPassword(!showConPassword)}
                  style={{ cursor: "pointer", margin: 0 }}
                ></i>
              </div>
              {errors.confirmPassword && (
                <div className="text-error">
                  {errors.confirmPassword.message}
                </div>
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

export default ResetPassword;
