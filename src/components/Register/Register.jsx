import { React, useState } from "react";
import Navbar from "../Navbar/Navbar";
import "./Register.css";
import { RegisterFormSchema } from "../YupValidation/Validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { ToastContainer, toast } from "react-toastify";
function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConPassword, setshowConPassword] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    resolver: yupResolver(RegisterFormSchema),
    reValidateMode: "onSubmit",
  });
  const onSubmit = async (data) => {
    console.log(data);
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/sendOTP", {
        email: data.email,
        username: data.username,
        password: data.confirmPassword,
      });
      navigate("/RegisterVerify", {
        state: {
          email: data.email,
          username: data.username,
          password: data.confirmPassword,
        },
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("อีเมลถูกใช้ไปแล้ว", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (error.response && error.response.status === 401) {
        toast.error("ชื่อผู้ใช้ถูกใช้ไปแล้ว", {
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
      <div className="register-page">
        <div className="register-container">
          <div className="register-header">
            <h2 className="text">ลงทะเบียน</h2>
          </div>
          <div className="register-inputs">
            <div>
              <div className="register-input">
                <i className="bx bxs-envelope"></i>
                <input
                  type="text"
                  placeholder="อีเมล"
                  maxLength="40"
                  {...register("email")}
                ></input>
              </div>
              {errors.email && (
                <div className="text-error">{errors.email.message}</div>
              )}
            </div>
            <div>
              <div className="register-input">
                <i className="bx bxs-user-circle"></i>
                <input
                  type="text"
                  placeholder="ชื่อผู้ใช้"
                  {...register("username")}
                ></input>
              </div>
              {errors.username && (
                <div className="text-error">{errors.username.message}</div>
              )}
            </div>
            <div>
              <div className="register-input">
                <i className="bx bxs-lock-alt"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="รหัสผ่าน"
                  {...register("password")}
                ></input>{" "}
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
            <div>
              <div className="register-input">
                <i className="bx bxs-lock-alt"></i>
                <input
                  type={showConPassword ? "text" : "password"}
                  placeholder="ยืนยันรหัสผ่าน"
                  {...register("confirmPassword")}
                ></input>
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
          <div className="Button-register">
            <div onClick={() => navigate("/login")}>มีบัญชีอยู่แล้ว</div>
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
                <h4>ลงทะเบียน</h4>
              )}
            </button>
          </div>
        </div>
      </div>{" "}
    </>
  );
}

export default Register;
