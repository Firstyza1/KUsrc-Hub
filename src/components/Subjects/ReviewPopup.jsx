import React, { useState, useEffect } from "react";
import "./ReviewPopup.css";
import axios from "axios";
import { ReviewdFormSchema } from "../YupValidation/Validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUser } from "../UserContext/User";
import { toast } from "react-toastify";
function ReviewPopup({
  subject_id,
  onClose,
  review_id,
  onSuccess,
  showSuccessToast,
}) {
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0); // สร้าง state สำหรับนับตัวอักษร
  const maxCharLimit = 500; // กำหนดขีดจำกัดตัวอักษร

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName("");
    }

    if (file && file.type !== "application/pdf") {
      setFileError("* รองรับเฉพาะไฟล์ PDF เท่านั้น");
      setFile(null);
      setFileName("");
      return;
    }

    if (file && file.size > 5 * 1024 * 1024) {
      setFileError("* ขนาดไฟล์ PDF ไม่เกิน 5MB");
      setFile(null);
      setFileName("");
      return;
    }

    setFile(file);
    setFileError("");
  };

  const currentYear = new Date().getFullYear() + 543;
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const [selectedYear, setSelectedYear] = useState("");
  const [options] = useState(["0", "1", "2", "3", "4"]);
  const [grades] = useState(["F", "D", "D+", "C", "C+", "B", "B+", "A"]);
  const { user } = useUser();
  const scoreTypes = [
    "จำนวนงานและการบ้าน",
    "ความน่าสนใจของเนื้อหา",
    "การสอนของอาจารย์",
  ];
  const Year = ["ต้น", "ปลาย", "ฤดูร้อน"];

  const {
    handleSubmit,
    formState: { errors },
    register,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(ReviewdFormSchema),
    reValidateMode: "onSubmit",
  });

  const reviewDesc = watch("review_desc", "");
  useEffect(() => {
    setCharCount(reviewDesc?.length || 0);
  }, [reviewDesc]);

  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  useEffect(() => {
    setValue("year", selectedYear);
  }, [selectedYear, setValue]);

  useEffect(() => {
    if (!review_id) return;
    const fetchReview = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/getReviewById/${review_id}`
        );
        if (response.data && response.data.length > 0) {
          const reviewData = response.data[0];
          setValue("review_desc", reviewData.review_desc);
          setValue("score0", reviewData.score_homework);
          setValue("score1", reviewData.score_content);
          setValue("score2", reviewData.score_teach);
          setValue("grade", reviewData.grade);
          setValue("semester", reviewData.semester);
          setValue("year", reviewData.academic_year);
        }
      } catch (error) {
        toast.error("เกิดข้อผิดพลาด", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        // console.error("เกิดข้อผิดพลาด :", error);
      }
    };
    fetchReview();
  }, [review_id, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    // console.log(data);
    try {
      const formData = new FormData();
      if (review_id) {
        formData.append("review_id", review_id);
      }
      if (file) {
        formData.append("file", file);
      }
      if (data.grade) {
        formData.append("grade", data.grade);
      }
      formData.append("user_id", user.user_id);
      formData.append("subject_id", subject_id);
      formData.append("review_desc", data.review_desc);
      formData.append("score_homework", data.score0);
      formData.append("score_content", data.score1);
      formData.append("score_teach", data.score2);
      formData.append("semester", data.semester);
      formData.append("academic_year", data.year);
      await axios.post("http://localhost:3000/createReview", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authtoken: `Bearer ${user?.token}`,
        },
      });
      onClose();
      onSuccess();
      showSuccessToast();
      // window.location.reload();
    } catch (error) {
      // console.error("Error occurred:", error.response || error);
      toast.error("เกิดข้อผิดพลาด", {
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

  const getIconForScore = (value) => {
    switch (value) {
      case "0":
        return <i className="bx bx-dizzy"></i>;
      case "1":
        return <i className="bx bx-tired"></i>;
      case "2":
        return <i className="bx bx-meh-alt"></i>;
      case "3":
        return <i className="bx bx-smile"></i>;
      case "4":
        return <i className="bx bx-happy-beaming"></i>;
      default:
        return null;
    }
  };

  return (
    <div className="popup-page">
      <div className="review-popup-container">
        <div className="review-header">
          <h3>เขียนรีวิว</h3>
          <i className="bx bx-x" onClick={onClose}></i>
        </div>
        <div className="review-content-container">
          <div className="review-text">
            <h4>
              เนื้อหา<span style={{ color: "red" }}> *</span>
            </h4>
            <textarea
              {...register("review_desc")}
              placeholder="เขียนรีวิวของคุณที่นี่..."
              maxLength={maxCharLimit} // จำกัดจำนวนตัวอักษร
              onChange={(e) => {
                if (e.target.value.length > maxCharLimit) {
                  e.target.value = e.target.value.substring(0, maxCharLimit);
                }
                setCharCount(e.target.value.length);
              }}
            />
            <div className="char-counter">
              <p>
                {charCount}/{maxCharLimit}
              </p>
            </div>
            {errors.review_desc && (
              <div className="text-error">{errors.review_desc.message}</div>
            )}
          </div>
          <div className="score-container">
            <div className="score-header">
              <h4>
                ให้คะแนนรายวิชา<span style={{ color: "red" }}> *</span>
              </h4>
              <div className="score-lv">
                <p>ไม่พึงพอใจ</p>
                <p>พึงพอใจ</p>
              </div>
            </div>
            {scoreTypes.map((scoreType, index) => (
              <div key={index} className="score-error">
                <div className="score-type">
                  <p>{scoreType}</p>
                  <div className="score-group">
                    {options.map((label, i) => {
                      const selectedValue = watch(`score${index}`);
                      return (
                        <label
                          key={i}
                          className={`score-label ${
                            selectedValue == label ? "selected" : ""
                          }`}
                        >
                          <input
                            type="radio"
                            value={label}
                            {...register(`score${index}`)}
                            // id={`score-${index}-${i}`}
                          />
                          {getIconForScore(label)}
                        </label>
                      );
                    })}
                  </div>
                </div>
                {errors[`score${index}`] && (
                  <div className="text-error">
                    {errors[`score${index}`]?.message}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="grade-container">
            <div className="grade-header">
              <h4>เกรดที่ได้</h4>
            </div>
            <div className="grade-group">
              {grades.map((label, index) => {
                const selectedValue = watch(`grade`);
                return (
                  <label
                    key={index}
                    className={`grade-label ${
                      selectedValue === label ? "selected" : ""
                    }`}
                    onClick={(e) => {
                      if (selectedValue === label) {
                        e.preventDefault();
                        setValue(`grade`, null); // ตั้งค่าเป็น null เมื่อคลิกที่ตัวเลือกเดิม
                      }
                    }}
                  >
                    <input
                      type="radio"
                      value={label}
                      {...register(`grade`)}
                      checked={selectedValue === label}
                    />
                    {label}
                  </label>
                );
              })}
            </div>
          </div>
          {errors[`grade`] && (
            <div className="text-error">{errors[`grade`]?.message}</div>
          )}

          <div className="semester-input">
            <h4>
              ภาคเรียน<span style={{ color: "red" }}> *</span>
            </h4>
            <div className="semester-group">
              {Year.map((label, index) => (
                <label key={index} className="semester-label">
                  <input
                    type="radio"
                    name="semester"
                    value={label}
                    {...register(`semester`)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
          {errors[`semester`] && (
            <div className="text-error">{errors[`semester`]?.message}</div>
          )}
          <div className="academic-year-input">
            <h4>
              ปีการศึกษา<span style={{ color: "red" }}> *</span>
            </h4>
            <select
              id="yearSelect"
              className="year-select"
              {...register("year")}
              // value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">-- กรุณาเลือกปี --</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          {errors[`year`] && (
            <div className="text-error">{errors[`year`]?.message}</div>
          )}

          <div className="file-pdf-input">
            <h4>ไฟล์สรุปรายวิชา</h4>
            <label type="file-upload" className="file-upload-label">
              เลือกไฟล์
              <input
                type="file"
                id="file-upload"
                accept=".pdf"
                className="file-upload-input"
                onChange={handleFileChange}
              />
            </label>
            {fileName && <span className="file-name">{fileName}</span>}
          </div>
          {fileError && <div className="text-error">{fileError}</div>}
          <div className="submit-review-container">
            <button
              className="submit-review"
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
            >
              {loading ? (
                <i
                  className="bx bx-loader-alt bx-spin bx-rotate-90"
                  style={{ fontSize: "17px" }} // ใช้ object
                ></i>
              ) : (
                <h4>รีวิว</h4>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewPopup;
