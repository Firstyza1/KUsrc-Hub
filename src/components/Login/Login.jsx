import { React, useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import "./Login.css";
import { Link } from "react-router-dom";
import { loginSchema } from "../YupValidation/Validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext/User";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
function Login() {
  const [loadingLogin, setloadingLogin] = useState(false);
  const navigate = useNavigate();
  const { user, loginUser, loading } = useUser();
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
    setloadingLogin(true);
    try {
      const response = await axios.post("http://localhost:3000/login", {
        email: data.email,
        password: data.password,
      });

      if (response.data.token) {
        loginUser(response.data.user, response.data.token);
      }
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 401) {
        toast.error("อีเมลหรือรหัสผ่านไม่ถูกต้อง", {
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
      setloadingLogin(false);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      if (user?.role === "admin") {
        navigate("/Dashboard");
        showLoginSuccess();
      } else if (user?.role === "user") {
        navigate("/Subjects");
        showLoginSuccess();
      }
    }
  }, [user, loading, navigate]);

  const showLoginSuccess = () => {
    toast.success("เข้าสู่ระบบสำเร็จ", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <>
      <Navbar />

      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <h2 className="text">เข้าสู่ระบบ</h2>
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
            <div onClick={() => navigate("/register")}>มีบัญชีไหม ?</div>
            <div onClick={() => navigate("/ForgotPassword")}>
              ลืมรหัสผ่านใช่หรือไม่ ?
            </div>
          </div>
          <div className="submit-container">
            <button
              className="submit"
              onClick={handleSubmit(onSubmit)}
              disabled={loadingLogin}
            >
              {loadingLogin ? (
                <ClipLoader color={"#ffffff"} size={18} />
              ) : (
                <h4>เข้าสู่ระบบ</h4>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
