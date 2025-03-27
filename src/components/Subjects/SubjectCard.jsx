import React, { useState, useEffect } from "react";
import axios from "axios";
// import { useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "./SubjectCard.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function SubjectCard({ subject_id }) {
  // const { subject_id } = useParams();
  const [subject, setSubject] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/Subjects/${subject_id}`
        );
        setSubject(response.data);
        console.log(response.data);
      } catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
            setError("ไม่พบข้อมูลรายวิชา");
          } else {
            setError(`เกิดข้อผิดพลาด: ${error.response.status}`);
          }
        } else {
          setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
        }
        console.error("เกิดข้อผิดพลาด:", error);
      }
    };

    if (subject_id) {
      fetchSubject();
    }
  }, [subject_id]);

  if (error) {
    return (
      <>
        <Navbar />
        <div className="error-container">
          <div className="text">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      {subject ? (
        <>
          <div className="header-text">
            <h5>
              {subject.subject_id} | {subject.subject_thai} (
              {subject.subject_eng})
            </h5>
          </div>
          <div className="subject-detail-item">
            <h4>หมวดหมู่ {subject.category_thai}</h4>
            <h4>หน่วยกิต {subject.credit}</h4>
          </div>
          {/* <div className="subject-detail-conttainer"> </div> */}
          <div className="subject-score-container">
            <div className="subject-score-detail">
              <div className="subject-score-header">
                <h4 className="score-name">คะแนนภาพรวมรายวิชา</h4>
                <div className="score-level">
                  <p>ไม่พึงพอใจ</p>
                  <p>พึงพอใจ</p>
                </div>
              </div>
              <div className="subject-score-item">
                <p className="score-name">จำนวนงานและการบ้าน</p>
                <div className="score-line">
                  <progress value={subject.percent_homework} max={100} />
                  <h5>{subject.percent_homework}%</h5>
                </div>
              </div>
              <div className="subject-score-item">
                <p className="score-name">ความน่าสนใจของเนื้อหา</p>
                <div className="score-line">
                  <progress value={subject.percent_content} max={100} />
                  <h5>{subject.percent_content}%</h5>
                </div>
              </div>
              <div className="subject-score-item">
                <p className="score-name">การสอนของอาจารย์</p>
                <div className="score-line">
                  <progress value={subject.percent_teach} max={100} />
                  <h5>{subject.percent_teach}%</h5>
                </div>
              </div>
            </div>
            {/* <div className="total-score">
                  <p >คะแนนรวมทั้งหมด</p>
                  <CircularProgressbar className="CircularProgressbar"
                    value={50}
                    text={`${50}%`}
                    styles={{
                      path: {
                        stroke: "#4caf50",
                        strokeLinecap: "round",
                      },
                      trail: {
                        stroke: "#eee",
                      },
                      text: {
                        fill: "#333",
                        fontSize: "16px",
                      },
                    }}
                  />
                </div> */}
          </div>
        </>
      ) : (
        <div className="loading-page">กำลังโหลด...</div>
      )}
    </>
  );
}

export default SubjectCard;
