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

function Register() {
  const [error, setError] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); 
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
        setError("อีเมลถูกใช้ไปแล้ว");
        setShowErrorPopup(true);
      } else if (error.response && error.response.status === 401) {
        setError("ชื่อผู้ใช้ถูกใช้ไปแล้ว");
        setShowErrorPopup(true);
      } else {
        setError("เกิดข้อผิดพลาด");
        setShowErrorPopup(true);
      }
    }finally {
      setLoading(false); 
    }
  };
  const closePopup = () => {
    setShowErrorPopup(false);
  };
  return (
    <>
      <Navbar />
      <div className="register-page">
        <div className="register-container">
          <div className="register-header">
            <div className="text">
              ลงทะเบียน<div className="underline"></div>
            </div>
          </div>
          <div className="register-inputs">
            <div>
              <div className="register-input">
                <i class="bx bxs-envelope"></i>
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
                <i class="bx bxs-user-circle"></i>
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
                <i class="bx bxs-lock-alt"></i>
                <input
                  type="password"
                  placeholder="รหัสผ่าน"
                  {...register("password")}
                ></input>
              </div>
              {errors.password && (
                <div className="text-error">{errors.password.message}</div>
              )}
            </div>
            <div>
              <div className="register-input">
                <i class="bx bxs-lock-alt"></i>
                <input
                  type="password"
                  placeholder="ยืนยันรหัสผ่าน"
                  {...register("confirmPassword")}
                ></input>
              </div>
              {errors.confirmPassword && (
                <div className="text-error">
                  {errors.confirmPassword.message}
                </div>
              )}
            </div>
          </div>
          <div className="Button-register">
            <Link to="/login">มีบัญอยู่แล้ว</Link>
          </div>
          <div className="submit-containter">
          <button
              className="submit"
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
            >
              {loading ? (
                <ClipLoader color={"#ffffff"} size={18} />
              ) : (
                "ลงทะเบียน"
              )}
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

export default Register;
