import { React, useState } from "react";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import "./Login.css";
import { Link } from "react-router-dom";
import { loginSchema } from "../YupValidation/Validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useUser } from "../User";
import ClipLoader from "react-spinners/ClipLoader";

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    resolver: yupResolver(loginSchema),
    reValidateMode: "onSubmit",
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/login", {
        email: data.email,
        password: data.password,
      });

      if (response.data.token) {
        loginUser(response.data.user, response.data.token);
        console.log(response.data.user);
        navigate("/");
      }
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 401) {
        alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
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
          <div className="login-header">
            <div className="text">
              เข้าสู่ระบบ<div className="underline"></div>
            </div>
          </div>
          <div className="login-inputs">
            <div>
              <div className="login-input">
                <i className="bx bxs-envelope"></i>
                <input
                  type="text"
                  placeholder="อีเมล"
                  maxLength="40"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <div className="text-error">{errors.email.message}</div>
              )}
            </div>
            <div>
              <div className="login-input">
                <i className="bx bxs-lock-alt"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="รหัสผ่าน"
                  {...register("password")}
                />
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
          </div>
          <div className="Button-login">
            <Link to="/register">มีบัญชีไหม ?</Link>
            <Link to="/ForgotPassword">ลืมรหัสผ่านใช่หรือไม่ ?</Link>
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
                "เข้าสู่ระบบ"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
