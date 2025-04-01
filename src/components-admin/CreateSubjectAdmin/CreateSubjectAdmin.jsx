import { React, useState, useEffect } from "react";
import "./CreateSubjectAdmin.css";
import { createSubjectFormSchema } from "../../components/YupValidation/Validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import SideBar from "../SideBar/SideBar";
import { useUser } from "../../components/UserContext/User";
import { toast } from "react-toastify";

function SubjectForm() {
  const location = useLocation();
  const { subject_id } = location.state || {};
  const category = [
    { id: 1, name: "กลุ่มสาระอยู่ดีมีสุข" },
    { id: 3, name: "กลุ่มสาระสุนทรียศาสตร์" },
    { id: 4, name: "กลุ่มสาระภาษากับการสื่อสาร" },
    { id: 2, name: "กลุ่มสาระศาสตร์แห่งผู้ประกอบการ" },
    { id: 5, name: "กลุ่มสาระพลเมืองไทยและพลเมืองโลก" },
  ];
  const [loading, setLoading] = useState(false);
  const url = "http://localhost:3000/createSubject";
  const navigate = useNavigate();
  const { user } = useUser();
  const [selectId, setSelectId] = useState(null);
  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(createSubjectFormSchema),
    defaultValues: {
      subjectID: "",
      subjectThai: "",
      subjectEnglish: "",
      credit: "",
      categoryId: 0,
    },
    reValidateMode: "onSubmit",
  });

  const handleSubject = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        url,
        {
          id: selectId,
          subject_id: data.subjectID,
          subject_thai: data.subjectThai,
          subject_eng: data.subjectEnglish,
          credit: data.credit,
          category_id: data.categoryId,
        },
        {
          headers: {
            authtoken: `Bearer ${user?.token}`,
          },
        }
      );
      let type;
      if (response.status === 201) {
        type = "เพิ่มรายวิชาสำเร็จ";
      } else if (response.status === 200) {
        type = "อัพเดตรายวิชาสำเร็จ";
      }
      toast.success(`${type}`, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      let errMessage;
      if (
        error.response &&
        error.response.data.message === "subject_id already exists"
      ) {
        errMessage = "รหัสรายวิชานี้มีอยู่แล้ว";
      } else if (
        error.response &&
        error.response.data.message === "subject_thai already exists"
      ) {
        errMessage = "ชื่อรายวิชาภาษาไทยนี้มีอยู่แล้ว";
      } else if (
        error.response &&
        error.response.data.message === "subject_eng already exists"
      ) {
        errMessage = "ชื่อรายวิชาภาษาอังกฤษนี้มีอยู่แล้ว";
      } else {
        errMessage = "เกิดข้อผิดพลาด";
      }
      toast.error(`${errMessage}`, {
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

  useEffect(() => {
    if (!subject_id) return;
    const fetchSubjectData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/Subjects/${subject_id}`
        );
        const subject = response.data;
        reset({
          subjectID: subject.subject_id,
          subjectEnglish: subject.subject_eng,
          subjectThai: subject.subject_thai,
          credit: subject.credit,
          categoryId: subject.category_id,
        });
        setSelectId(subject.id);
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

  const getCategoryColor = (categoryId) => {
    switch (categoryId) {
      case 1:
        return " #90da9f";
      case 2:
        return " #ffbf80";
      case 3:
        return " #7c9bff";
      case 4:
        return " #80d4ff";
      case 5:
        return " #ff8080";
      default:
        return "#95a5a6";
    }
  };

  return (
    <>
      {" "}
      {loading && (
        <div className="loader-overlay">
          <div className="loader">
            <i class="bx bx-loader-circle bx-spin bx-rotate-90"></i>
          </div>
        </div>
      )}
      <SideBar />
      <div className="create-subject-page">
        <div className="create-subject-container">
          <div className="edit-subject-header">
            <i
              className="bx bx-chevron-left back-icon"
              onClick={() => navigate(-1)}
            ></i>
            <h2 className="text">แบบฟอร์มข้อมูลรายวิชา</h2>
          </div>
          <div className="create-subject-inputs-1">
            <div className="create-subject-input">
              <p>รหัสรายวิชา</p>
              <input
                type="text"
                placeholder="กรุณาใส่รหัสรายวิชา"
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
              <p>ชื่อรายวิชา ภาษาไทย</p>
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
              <p>ชื่อรายวิชา ภาษาอังกฤษ</p>
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
              <p>หน่วยกิต</p>
              <input
                type="text"
                placeholder="กรุณาใส่จำนวนหน่วยกิต"
                maxLength="1"
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
            <p>หมวดหมู่วิชา</p>
            <div
              className="category-group"
              style={{ display: "flex", flexDirection: "column" }}
            >
              {category.map((label) => {
                const selectedValue = watch("categoryId");
                return (
                  <label
                    key={label.id}
                    style={{
                      borderLeft: `7px solid ${getCategoryColor(label.id)}`,
                      width: "fit-content",
                    }}
                  >
                    <input
                      type="radio"
                      value={label.id}
                      // {...register("categoryId")}
                      checked={selectedValue === label.id}
                      onChange={() => setValue("categoryId", label.id)}
                    />
                    <p>{label.name}</p>
                  </label>
                );
              })}
            </div>
            {errors.categoryId && (
              <div className="create-subject-error">
                {errors.categoryId.message}
              </div>
            )}
          </div>
          <div className="create-subject-submit">
            <button
              className="btn-submit"
              onClick={handleSubmit(handleSubject)}
              disabled={loading}
            >
              <h4>ยืนยัน</h4>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SubjectForm;
