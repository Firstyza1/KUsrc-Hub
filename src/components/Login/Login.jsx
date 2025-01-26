import { React, useState } from "react";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import "./Login.css";
import { Link } from "react-router-dom";
import { loginSchema } from "../YupValidation/Validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

function Login() {
  const [error, setError] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    resolver: yupResolver(loginSchema),
    reValidateMode: "onSubmit", 
  });

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await axios.post("http://localhost:3000/login", {
        email: data.email,
        password: data.password,
      });
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        window.location.href = "/about";
      } else {
        setError(response.data.message || "เกิดข้อผิดพลาด");
        setShowErrorPopup(true);
      }
    } catch (error) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      setShowErrorPopup(true);
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
          <div className="login-header">
            <div className="text">
              เข้าสู่ระบบ<div className="underline"></div>
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
                  {...register("email")} 
                />
              </div>
              {errors.email && <div className="login-error">{errors.email.message}</div>}
            </div>
            <div>
              <div className="login-input">
                <i className="bx bxs-lock-alt"></i>
                <input
                  type="password"
                  placeholder="รหัสผ่าน"
                  {...register("password")} 
                />
              </div>
              {errors.password && <div className="login-error">{errors.password.message}</div>}
            </div>
          </div>
          <div className="Button-login">
            <Link to="/register">มีบัญชีไหม</Link>
            <Link to="/ForgotPassword">ลืมรหัสผ่านใช่หรือไม่</Link>
          </div>
          <div className="submit-container">
            <button className="submit" onClick={handleSubmit(onSubmit)}>
              เข้าสู่ระบบ
            </button>
          </div>
        </div>
      </div>

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

export default Login;
