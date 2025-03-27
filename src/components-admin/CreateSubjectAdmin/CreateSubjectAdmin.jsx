import { React, useState } from "react";
import "./CreateSubjectAdmin.css";
import { createSubjectFormSchema } from "../../components/YupValidation/Validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import SideBar from "../SideBar/SideBar";
import { useUser } from "../../components/UserContext/User";
import { toast } from "react-toastify";
function CreateSubjectForm() {
  const [loading, setLoading] = useState(false);
  const url = "http://localhost:3000/requestSubject";
  const navigate = useNavigate();
  const { user } = useUser();
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
      const response = await axios.post(
        url,
        {
          subject_id: data.subjectID,
          subject_thai: data.subjectThai,
          subject_eng: data.subjectEnglish,
          credit: data.credit,
          category_id: data.selectedSubject,
        },
        {
          headers: {
            authtoken: `Bearer ${user?.token}`,
          },
        }
      );
      toast.success("เพิ่มรายวิชาสำเร็จ", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // window.location.reload();
    } catch (error) {
      if (
        error.response &&
        error.response.data.message === "subject_id is madatory"
      ) {
        toast.error("รหัสรายวิชานี้มีอยู่แล้ว", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (
        error.response &&
        error.response.data.message === "subject_thai is madatory"
      ) {
        toast.error("ชื่อรายวิชาภาษาไทยนี้มีอยู่แล้ว", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (
        error.response &&
        error.response.data.message === "subject_eng is madatory"
      ) {
        toast.error("ชื่อรายวิชาภาษาอังกฤษนี้มีอยู่แล้ว", {
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
      <SideBar />
      <div className="create-subject-page">
        <div className="create-subject-container">
          <div className="create-subject-header">
            <i
              className="bx bx-chevron-left back-icon"
              onClick={handleGoBack}
            ></i>
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
