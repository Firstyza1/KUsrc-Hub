import { react, useEffect } from "react";
import "./PopupLogin.css";
import { useNavigate } from "react-router-dom";
const PopupLogin = ({ onClose }) => {
  const navigate = useNavigate();
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);
  return (
    <div className="popup-page">
      <div className="PopupLogin-container">
        <h2>คุณยังไม่ได้เข้าสู่ระบบ</h2>
        <span>คุณจะสามารถใช้งานฟีเจอร์ต่างๆ</span>
        <span> เมื่อเข้าสู่ระบบแล้วเท่านั้น</span>
        <div className="PopupLogin-btn">
          <button className="PopupLogin-cancle" onClick={() => onClose()}>
            ยกเลิก
          </button>
          <button
            className="PopupLogin-submit"
            onClick={() => navigate("/Login")}
          >
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupLogin;
