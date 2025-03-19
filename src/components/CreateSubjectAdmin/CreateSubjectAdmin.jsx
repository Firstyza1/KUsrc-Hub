import { React, useState } from "react";
import "./CreateSubjectAdmin.css";
import { createSubjectFormSchema } from "../YupValidation/Validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import SideBar from "../SideBar/SideBar";
function CreateSubjectForm() {
  const [loading, setLoading] = useState(false);
  const url = "http://localhost:3000/requestSubject";
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    resolver: yupResolver(createSubjectFormSchema),
    reValidateMode: "onSubmit",
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(url, {
        subject_id: data.subjectID,
        subject_thai: data.subjectThai,
        subject_eng: data.subjectEnglish,
        credit: data.credit,
        category_id: data.selectedSubject,
      });
      alert("สร้างรายวิชาสำเร็จ!");
      console.log("Response:", response.data);
      window.location.reload();
    } catch (error) {
      console.error("Error occurred:", error);
      if (error.response) {
        console.log("Response Error Data:", error.response.data);
        alert(
          `เกิดข้อผิดพลาด: ${
            error.response.data.message || "ไม่สามารถส่งคำร้องได้"
          }`
        );
      } else if (error.request) {
        console.log("Request Error:", error.request);
        alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง");
      } else {
        console.log("General Error:", error.message);
        alert(`เกิดข้อผิดพลาด: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SideBar />
      <div className="create-subject-page">
        <div className="create-subject-container">
          <div className="create-subject-header">
          <i className="bx bx-chevron-left back-icon" onClick={handleGoBack}></i>
            <div className="text">
              แบบฟอร์มเพิ่มรายวิชาลงในระบบ
              <div className="underline"></div>
            </div>
          </div>
          <div className="create-subject-inputs-1">
            <div className="create-subject-input">
              <label>รหัสวิชา</label>
              <input
                type="text"
                placeholder="กรุณาใส่รหัสวิชา"
                maxLength="40"
                {...register("subjectID")}
              ></input>
              {errors.subjectID && (
                <div className="create-subject-error">
                  {errors.subjectID.message}
                </div>
              )}
            </div>
            <div className="create-subject-input">
              <label>ชื่อรายวิชา ภาษาไทย</label>
              <input
                type="text"
                placeholder="กรุณาใส่ชื่อรายวิชา ภาษาไทย"
                maxLength="40"
                {...register("subjectThai")}
              ></input>
              {errors.subjectThai && (
                <div className="create-subject-error">
                  {errors.subjectThai.message}
                </div>
              )}
            </div>
            <div className="create-subject-input">
              <label>ชื่อรายวิชา ภาษาอังกฤษ</label>
              <input
                type="text"
                placeholder="กรุณาใส่ชื่อรายวิชา ภาษาอังกฤษ"
                maxLength="40"
                {...register("subjectEnglish")}
              ></input>
              {errors.subjectEnglish && (
                <div className="create-subject-error">
                  {errors.subjectEnglish.message}
                </div>
              )}
            </div>
            <div className="create-subject-input">
              <label>หน่วยกิต</label>
              <input
                type="text"
                placeholder="กรุณาใส่จำนวนหน่วยกิต"
                maxLength="40"
                {...register("credit")}
              ></input>
              {errors.credit && (
                <div className="create-subject-error">
                  {errors.credit.message}
                </div>
              )}
            </div>
          </div>
          <div className="create-subject-inputs-2">
            <label>หมวดหมู่ศึกษาทั่วไป</label>
            <div className="radio-item">
              <input
                type="radio"
                name="subject-type"
                value={1}
                {...register("selectedSubject")}
              />
              <mark id="health">กลุ่มสาระอยู่ดีมีสุข</mark>
            </div>
            <div className="radio-item">
              <input
                type="radio"
                name="subject-type"
                value={2}
                {...register("selectedSubject")}
              />
              <mark id="entrepreneur">กลุ่มสาระศาสตร์แห่งผู้ประกอบการ</mark>
            </div>
            <div className="radio-item">
              <input
                type="radio"
                name="subject-type"
                value={3}
                {...register("selectedSubject")}
              />
              <mark id="aesthetics">กลุ่มสาระสุนทรียศาสตร์</mark>
            </div>
            <div className="radio-item">
              <input
                type="radio"
                name="subject-type"
                value={4}
                {...register("selectedSubject")}
              />
              <mark id="language">กลุ่มสาระภาษากับการสื่อสาร</mark>
            </div>
            <div className="radio-item">
              <input
                type="radio"
                name="subject-type"
                value={5}
                {...register("selectedSubject")}
              />
              <mark id="citizen">กลุ่มสาระพลเมืองไทยและพลเมืองโลก</mark>
            </div>
            {errors.selectedSubject && (
              <div className="create-subject-error">
                {errors.selectedSubject.message}
              </div>
            )}
          </div>
          <div className="create-subject-submit">
            <button
              className="btn-submit"
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
            >
              {loading ? (
                <ClipLoader color={"#ffffff"} size={18} />
              ) : (
                "ส่งคำร้อง"
              )}
            </button>
          </div>
        </div>
      </div>{" "}
    </>
  );
}

export default CreateSubjectForm;
