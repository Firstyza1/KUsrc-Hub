import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SideBar from "../SideBar/SideBar";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import "./EditSubjectAdmin.css";
import { useUser } from "../../components/UserContext/User";
function EditSubjectAdmin() {
  const { subject_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [subjectData, setSubjectData] = useState({});
  const [initialData, setInitialData] = useState({});
  const { user } = useUser();
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
        const response = await axios.get(
          `http://localhost:3000/Subjects/${subject_id}`
        );
        const subject = response.data;
        const category = categories.find(
          (cat) => cat.name === subject.category_thai
        );
        const formattedData = {
          ...subject,
          category_id: category ? category.id : null,
          new_subject_id: subject.subject_id,
        };

        setSubjectData(formattedData);
        setInitialData(formattedData);
      } catch (error) {
        toast.error("เกิดข้อผิดพลาดในการดึงข้อมูล", {
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
    setLoading(true);

    try {
      await axios.put(
        `http://localhost:3000/updateSubject/${subject_id}`,
        {
          ...subjectData,
          subject_id: subjectData.new_subject_id,
        },
        {
          headers: {
            authtoken: `Bearer ${user?.token}`,
          },
        }
      );

      toast.success("แก้ไขรายวิชาสำเร็จ", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการแก้ไขรายวิชา", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const isChanged = JSON.stringify(subjectData) !== JSON.stringify(initialData);

  return (
    <>
      <SideBar />

      {/* Loader Overlay */}
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
            <i
              className="bx bx-chevron-left back-icon"
              onClick={() => navigate(-1)}
            ></i>
            <div className="text">
              แก้ไขข้อมูลรายวิชา<div className="underline"></div>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="edit-subject-inputs">
              <div className="edit-subject-input">
                <label>รหัสวิชา</label>
                <input
                  type="text"
                  name="new_subject_id"
                  value={subjectData.new_subject_id || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="edit-subject-input">
                <label>ชื่อวิชา (ไทย)</label>
                <input
                  type="text"
                  name="subject_thai"
                  value={subjectData.subject_thai || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="edit-subject-input">
                <label>ชื่อวิชา (อังกฤษ)</label>
                <input
                  type="text"
                  name="subject_eng"
                  value={subjectData.subject_eng || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="edit-subject-input">
                <label>หน่วยกิต</label>
                <input
                  type="text"
                  name="credit"
                  value={subjectData.credit || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="create-subject-inputs-2">
                <label>หมวดหมู่ศึกษาทั่วไป</label>
                {categories.map((category) => (
                  <div className="radio-item" key={category.id}>
                    <input
                      type="radio"
                      name="category_id"
                      value={category.id}
                      checked={subjectData.category_id === category.id}
                      onChange={handleChange}
                    />
                    <mark id={category.markId}>{category.name}</mark>
                  </div>
                ))}
              </div>
            </div>
            <div className="edit-subject-submit">
              <button
                type="submit"
                className="btn-submit"
                disabled={!isChanged || loading}
              >
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
