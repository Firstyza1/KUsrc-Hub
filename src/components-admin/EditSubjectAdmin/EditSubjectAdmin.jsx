import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SideBar from "../SideBar/SideBar";
import ClipLoader from "react-spinners/ClipLoader"; // เพิ่ม ClipLoader
import "./EditSubjectAdmin.css";

function EditSubjectAdmin() {
  const { subject_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // ใช้สถานะ loading
  const [subjectData, setSubjectData] = useState({});
  const [initialData, setInitialData] = useState({});
  const [popupMessage, setPopupMessage] = useState("");
  const [popupIcon, setPopupIcon] = useState("");
  const [popupColor, setPopupColor] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const categories = [
    { id: 1, name: "กลุ่มสาระอยู่ดีมีสุข", markId: "health" },
    { id: 2, name: "กลุ่มสาระศาสตร์แห่งผู้ประกอบการ", markId: "entrepreneur" },
    { id: 3, name: "กลุ่มสาระสุนทรียศาสตร์", markId: "aesthetics" },
    { id: 4, name: "กลุ่มสาระภาษากับการสื่อสาร", markId: "language" },
    { id: 5, name: "กลุ่มสาระพลเมืองไทยและพลเมืองโลก", markId: "citizen" },
  ];

  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/getSubjectByID/${subject_id}`);
        const subject = response.data.subject;
        const category = categories.find((cat) => cat.name === subject.category_name);
        const formattedData = {
          ...subject,
          category_id: category ? category.id : null,
          new_subject_id: subject.subject_id,
        };

        setSubjectData(formattedData);
        setInitialData(formattedData);
      } catch (error) {
        showPopup("เกิดข้อผิดพลาดในการดึงข้อมูล", "bx bx-x", "red");
      }
    };
    fetchSubjectData();
  }, [subject_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubjectData({
      ...subjectData,
      [name]: name === "category_id" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // เปิดสถานะ loading เมื่อกดปุ่มบันทึก

    // หน่วงเวลา 3 วินาที
    setTimeout(async () => {
      try {
        await axios.put(`http://localhost:3000/updateSubject/${subject_id}`, {
          ...subjectData,
          subject_id: subjectData.new_subject_id,
        });
        showPopup("แก้ไขรายวิชาสำเร็จ!", "bx bx-check", "green");
        // setTimeout(() => navigate("/ManageSubject"), 3000);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } catch (error) {
        showPopup("เกิดข้อผิดพลาดในการแก้ไขรายวิชา", "bx bx-x", "red");
      } finally {
        setLoading(false); // ปิดสถานะ loading เมื่อเสร็จสิ้นการอัปเดต
      }
    }, 3000); // Delay 3 วินาที
  };

  const showPopup = (message, icon, color) => {
    setPopupMessage(message);
    setPopupIcon(icon);
    setPopupColor(color);
    setIsPopupVisible(true);
    setTimeout(() => setIsPopupVisible(false), 3000);
  };

  const isChanged = JSON.stringify(subjectData) !== JSON.stringify(initialData);

  return (
    <>
      <SideBar />
      {isPopupVisible && (
        <div className="popup-message">
          <i className={popupIcon} style={{ color: popupColor }}></i>
          <p>{popupMessage}</p>
        </div>
      )}

      {/* ✅ Loader Popup */}
      {loading && (
        <div className="loader-overlay">
          <div className="loader">
            <ClipLoader color="#02BC77" size={50} />
            <p>กำลังบันทึกข้อมูล...</p>
          </div>
        </div>
      )}

      <div className="edit-subject-page">
        <div className="edit-subject-container">
          <div className="edit-subject-header">
            <i className="bx bx-chevron-left back-icon" onClick={() => navigate(-1)}></i>
            <div className="text">แก้ไขข้อมูลรายวิชา<div className="underline"></div></div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="edit-subject-inputs">
              <div className="edit-subject-input">
                <label>รหัสวิชา</label>
                <input type="text" name="new_subject_id" value={subjectData.new_subject_id || ""} onChange={handleChange} />
              </div>
              <div className="edit-subject-input">
                <label>ชื่อวิชา (ไทย)</label>
                <input type="text" name="subject_thai" value={subjectData.subject_thai || ""} onChange={handleChange} />
              </div>
              <div className="edit-subject-input">
                <label>ชื่อวิชา (อังกฤษ)</label>
                <input type="text" name="subject_eng" value={subjectData.subject_eng || ""} onChange={handleChange} />
              </div>
              <div className="edit-subject-input">
                <label>หน่วยกิต</label>
                <input type="text" name="credit" value={subjectData.credit || ""} onChange={handleChange} />
              </div>
              <div className="create-subject-inputs-2">
                <label>หมวดหมู่ศึกษาทั่วไป</label>
                {categories.map((category) => (
                  <div className="radio-item" key={category.id}>
                    <input type="radio" name="category_id" value={category.id} checked={subjectData.category_id === category.id} onChange={handleChange} />
                    <mark id={category.markId}>{category.name}</mark>
                  </div>
                ))}
              </div>
            </div>
            <div className="edit-subject-submit">
              <button type="submit" className="btn-submit" disabled={!isChanged || loading}>
                {loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditSubjectAdmin;
