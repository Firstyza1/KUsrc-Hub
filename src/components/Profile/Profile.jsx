import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import "./Profile.css";
import { Link } from "react-router-dom";

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState({ username: "", email: "", created_at: "" });

  const [popupMessage, setPopupMessage] = useState("");
  const [popupIcon, setPopupIcon] = useState("");
  const [popupColor, setPopupColor] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const showPopup = (message, icon, color) => {
    setPopupMessage(message);
    setPopupIcon(icon);
    setPopupColor(color);
    setIsPopupVisible(true);

    setTimeout(() => {
      setIsPopupVisible(false);
    }, 3000);
  };

  const fetchAPI = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/userProfile/${id}`
      );
      setUser(response.data.user);
    } catch (err) {
      console.error("Error fetching data:", err);
      showPopup("ไม่สามารถดึงข้อมูลได้", "bx bx-x", "red");
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  // แปลง created_at ให้แสดงวันที่ในรูปแบบ DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');  // ทำให้วันเป็น 2 หลัก
    const month = String(date.getMonth() + 1).padStart(2, '0');  // ทำให้เดือนเป็น 2 หลัก
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <Navbar />
      <div className="profile-card">
        <div className="profile-container">
          <h1>โปรไฟล์</h1>
          <img className="profile-img" src={user.user_profile} alt="Profile" />
          <div className="display-text-1">
            <p>{user.username}</p>
          </div>
          <div className="display-text-2">
            <p>
              <i className="bx bx-envelope"></i>&nbsp;&nbsp;{user.email}
            </p>
            <p>
              <i className="bx bx-calendar"></i>&nbsp;&nbsp;เข้าร่วมเมื่อ :{" "}
              {user.created_at ? formatDate(user.created_at) : ""}
            </p>
          </div>
          <div>
            <div className="editprofile-button">
              <Link to={`/EditProfile/${id}`} className="edit-link">แก้ไขโปรไฟล์</Link>
            </div>
          </div>
        </div>
      </div>

      {isPopupVisible && (
        <div className="popup-message">
          <i className={popupIcon} style={{ color: popupColor }}></i>
          <p>{popupMessage}</p>
        </div>
      )}
    </>
  );
}

export default Profile;
