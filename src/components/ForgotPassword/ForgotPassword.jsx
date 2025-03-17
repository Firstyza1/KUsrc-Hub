import { React, useState } from "react";
import { useNavigate } from "react-router-dom"; // นำเข้า useNavigate
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import "../Login/Login.css";
import { ResetPasswordFormSchema } from "../YupValidation/Validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ClipLoader from "react-spinners/ClipLoader";

function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    resolver: yupResolver(ResetPasswordFormSchema),
    reValidateMode: "onSubmit",
  });

  const onSubmit = async (data) => {
    console.log(data);
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/forgotPassword",
        {
          email: data.email,
        }
      );
      navigate("/EmailVerify", { state: { email: data.email } });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert("อีเมลไม่ถูกต้อง");
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
          <div className="login-header" >
            <i className="bx bx-chevron-left" onClick={() => navigate(-1)}></i>
            <h2 className="text">ลืมรหัสผ่าน</h2>
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
                ></input>
              </div>
              {errors.email && (
                <div className="text-error">{errors.email.message}</div>
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

export default ForgotPassword;
