import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import "./EditProfileAdmin.css";
import SideBar from "../SideBar/SideBar";
import { useNavigate } from "react-router-dom";
function EditProfileAdmin() {
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [user, setUser] = useState({ username: "", email: "" });
  const [preview, setPreview] = useState("");
  const [username, setUsername] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };
  // ✅ State ใหม่สำหรับ Popup แจ้งเตือน
  const [popupMessage, setPopupMessage] = useState("");
  const [popupIcon, setPopupIcon] = useState("");
  const [popupColor, setPopupColor] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const fetchAPI = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/userProfile/${id}`
      );
      setUser(response.data.user);
      setUsername(response.data.user.username);
    } catch (err) {
      console.error("Error fetching data:", err);
      showPopup("ไม่สามารถดึงข้อมูลได้", "bx bx-x", "red");
    }
  };

  useEffect(() => {
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else if (user.user_profile) {
      setPreview(user.user_profile);
    } else {
      setPreview(
        "https://i.pinimg.com/1200x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"
      );
    }
  }, [file, user.user_profile]);

  useEffect(() => {
    fetchAPI();
  }, []);

  const cancelButton = () => {
    window.location.reload();
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setIsLoading(true);

    setTimeout(async () => {
      const formData = new FormData();
      formData.append("username", username);
      if (file) {
        formData.append("file", file);
      }

      try {
        await axios.put(
          `http://localhost:3000/updateUserProfile/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        showPopup("อัปเดตโปรไฟล์สำเร็จ!", "bx bx-check", "green");

        // ✅ รีเฟรชหน้าเว็บหลังจากแสดง popup 3 วินาที
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "เกิดข้อผิดพลาด กรุณาลองอีกครั้ง";
        showPopup(
          `ไม่สามารถอัปเดตโปรไฟล์ได้: ${errorMessage}`,
          "bx bx-x",
          "red"
        );
      }

      setIsSubmitting(false);
      setIsLoading(false);
    }, 3000);
  };

  // ✅ ฟังก์ชันแสดง Popup แจ้งเตือน
  const showPopup = (message, icon, color) => {
    setPopupMessage(message);
    setPopupIcon(icon);
    setPopupColor(color);
    setIsPopupVisible(true);

    setTimeout(() => {
      setIsPopupVisible(false);
    }, 3000);
  };

  // ✅ ตรวจสอบว่ามีการเปลี่ยนแปลงข้อมูลหรือไม่
  const isButtonDisabled = username === user.username && !file || username === "";

  return (
    <>
        <SideBar />
      {/* ✅ Loader Popup */}
      {isLoading && (
        <div className="loader-overlay">
          <div className="loader">
            <ClipLoader color="#02BC77" size={50} />
            <p>กำลังอัปเดตข้อมูล...</p>
          </div>
        </div>
      )}

      {/* ✅ Popup แจ้งเตือน */}
      {isPopupVisible && (
        <div className="popup-message">
          <i className={popupIcon} style={{ color: popupColor }}></i>
          <p>{popupMessage}</p>
        </div>
      )}
      <div className="header-container">
      <i className="bx bx-chevron-left back-icon" onClick={handleGoBack}></i>
        <h1>เเก้ไขโปรไฟล์</h1>
      </div>
      <div className="editprofile-card">
        <div className="editprofile-container">
          <div className="img-profile">
            <img src={preview} alt="Profile" />
          </div>
          <label className="upload-button">
            อัปโหลดรูปภาพ
            <input
              type="file"
              accept=".png, .jpeg, .jpg"
              onChange={handleFileChange}
              hidden
            />
          </label>
          <div className="form-group">
            <label>อีเมล</label>
            <input
              type="text"
              maxLength="40"
              placeholder={user.email}
              disabled
            />
          </div>
          <div className="form-group">
            <label>ชื่อผู้ใช้</label>
            <div className="input-container">
              <input
                type="text"
                value={username || ""}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={user.username || "กรอกชื่อผู้ใช้ใหม่..."}
              />
              <i className="bx bx-edit"></i>
            </div>
          </div>
          <div className="button-container">
            <div className="cancel-button">
              <button type="button" onClick={cancelButton}>
                <i className="bx bxs-x-circle"></i>ยกเลิก
              </button>
            </div>
            <div className="edit-button">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isButtonDisabled}
                style={{ backgroundColor: isButtonDisabled ? "gray" : "" }}
              >
                <i className="bx bx-edit"></i>
                เเก้ไข
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProfileAdmin;
