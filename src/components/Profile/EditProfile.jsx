import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import Navbar from "../Navbar/Navbar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./EditProfile.css";

function Editprofile() {
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [user, setUser, loading] = useState({ username: "", email: "" });
  const [preview, setPreview] = useState("");
  const [username, setUsername] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const fetchAPI = async () => {
    if (!loading) {
      if (!user) return;
    }
    try {
      const response = await axios.get(
        `http://localhost:3000/userProfile/${id}`
      );
      setUser(response.data.user);
      setUsername(response.data.user.username);
    } catch (err) {
      console.error("Error fetching data:", err);
      showToast("ไม่สามารถดึงข้อมูลได้", "error");
    }
  };

  useEffect(() => {
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else if (user.user_profile) {
      setPreview(user.user_profile);
    }
  }, [file, user.user_profile]);

  useEffect(() => {
    fetchAPI();
  }, []);

  const cancelButton = () => {
    window.location.reload();
  };

  const showToast = (message, type) => {
    if (type === "success") {
      toast.success(message, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (type === "error") {
      toast.error(message, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
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
        showToast("อัปเดตโปรไฟล์สำเร็จ", "success");

        // setTimeout(() => {
        //   window.location.reload();
        // }, 3000);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "เกิดข้อผิดพลาด กรุณาลองอีกครั้ง";
        showToast(`ไม่สามารถอัปเดตโปรไฟล์ได้: ${errorMessage}`, "error");
      }

      setIsSubmitting(false);
      setIsLoading(false);
    }, 3000);
  };

  const isButtonDisabled =
    (username === user.username && !file) || username === "";

  return (
    <>
      <Navbar />

      {isLoading && (
        <div className="loader-overlay">
          <div className="loader">
            <ClipLoader color="#02BC77" size={50} />
            <p>กำลังอัปเดตข้อมูล...</p>
          </div>
        </div>
      )}

      <div className="header-container">
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={user.username || "กรอกชื่อผู้ใช้ใหม่..."}
              />
              {/* <i className="bx bx-edit"></i> */}
            </div>
          </div>
          <div className="button-container">
            <button className="cancel-button" onClick={cancelButton}>
              <i className="bx bxs-x-circle"></i>
              <p>ยกเลิก</p>
            </button>
            <button
              className="edit-profile-button"
              onClick={handleSubmit}
              disabled={isButtonDisabled}
              style={{ backgroundColor: isButtonDisabled ? "gray" : "" }}
            >
              <i className="bx bx-edit"></i>
              <p>เเก้ไข</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Editprofile;
