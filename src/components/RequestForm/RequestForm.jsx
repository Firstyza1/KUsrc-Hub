import React from "react";
import "./RequestForm.css";
import Navbar from "../Navbar/Navbar";
import { requestFormSchema } from "../YupValidation/Validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

function RequestForm() {
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    resolver: yupResolver(requestFormSchema),
    reValidateMode: "onSubmit",
  });

  const onSubmit = async (data) => {
    console.log(data);
  };

  return (
    <>
      <Navbar />
      <div className="request-page">
        <div className="request-container">
          <div className="request-header">
            <div className="text">
              แบบฟอร์มเพิ่มรายวิชาลงในระบบ
              <div className="underline"></div>
            </div>
          </div>
          <div className="request-inputs-1">
            <div className="request-input">
              <label>รหัสวิชา</label>
              <input
                type="text"
                placeholder="กรุณาใส่รหัสวิชา"
                maxLength="40"
                {...register("subjectID")}
              ></input>
              {errors.subjectID && (
                <div className="request-error">{errors.subjectID.message}</div>
              )}
            </div>
            <div className="request-input">
              <label>ชื่อรายวิชา ภาษาไทย</label>
              <input
                type="text"
                placeholder="กรุณาใส่ชื่อรายวิชา ภาษาไทย"
                maxLength="40"
                {...register("subjectThai")}
              ></input>
              {errors.subjectThai && (
                <div className="request-error">{errors.subjectThai.message}</div>
              )}
            </div>
            <div className="request-input">
              <label>ชื่อรายวิชา ภาษาอังกฤษ</label>
              <input
                type="text"
                placeholder="กรุณาใส่ชื่อรายวิชา ภาษาอังกฤษ"
                maxLength="40"
                {...register("subjectEnglish")}
              ></input>
              {errors.subjectEnglish && (
                <div className="request-error">{errors.subjectEnglish.message}</div>
              )}
            </div>
            <div className="request-input">
              <label>หน่วยกิต</label>
              <input
                type="text"
                placeholder="กรุณาใส่จำนวนหน่วยกิต"
                maxLength="40"
                {...register("credit")}
              ></input>
              {errors.credit && (
                <div className="request-error">{errors.credit.message}</div>
              )}
            </div>
          </div>
          <div className="request-inputs-2">
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
              <div className="request-error">{errors.selectedSubject.message}</div>
            )}
          </div>
          <div className="request-submit">
            <div className="submit" onClick={handleSubmit(onSubmit)}>
              ส่งคำร้อง
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RequestForm;
