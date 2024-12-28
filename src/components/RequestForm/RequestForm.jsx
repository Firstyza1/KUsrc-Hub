import React from "react";
import "./RequestForm.css";
import Navbar from "../Navbar/Navbar";
function RequestForm() {
  return (
    <>
      <Navbar />
      <div className="request-header">
        <h1>แบบฟอร์มเพิ่มรายวิชาลงในระบบ</h1>
      </div>
      <form className="request-form-container">
        <div className="request-container1">
          <div className="request-container1-row1">
            <div className="subject-id-control">
              <label>รหัสวิชา</label>
              <input type="text" />
            </div>
            <div className="subject-credit-control">
              <label>หน่วยกิต</label>
              <input type="text" />
            </div>
          </div>
          <div className="request-container1-row2">
            <div className="subject-thainame-control">
              <label>ชื่อรายวิชา ภาษาไทย</label>
              <input type="text" />
            </div>
            <div className="subject-engname-control">
              <label>ชื่อรายวิชา ภาษาอังกฤษ</label>
              <input type="text" />
            </div>
          </div>
        </div>
        <div className="request-container2">
          <p>หมวดหมู่ศึกษาทั่วไป</p>
          <div className="radio-control">
            <div className="radio-item">
              <input type="radio" name="subject-type" />
              <mark id="health">กลุ่มสาระอยู่ดีมีสุข</mark>
            </div>
            <div className="radio-item">
              <input type="radio" name="subject-type" />
              <mark id="entrepreneur">กลุ่มสาระศาสตร์แห่งผู้ประกอบการ</mark>
            </div>
            <div className="radio-item">
              <input type="radio" name="subject-type" />
              <mark id="aesthetics">กลุ่มสาระสุนทรียศาสตร์</mark>
            </div>
            <div className="radio-item">
              <input type="radio" name="subject-type" />
              <mark id="language">กลุ่มสาระภาษากับการสื่อสาร</mark>
            </div>
            <div className="radio-item">
              <input type="radio" name="subject-type" />
              <mark id="citizen">กลุ่มสาระพลเมืองไทยและพลเมืองโลก</mark>
            </div>
          </div>
        </div>
        <div className="submit-form">
          <button type="submit">ส่งคำร้อง</button>
        </div>
      </form>
    </>
  );
}

export default RequestForm;
