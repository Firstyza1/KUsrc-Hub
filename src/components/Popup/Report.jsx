import React, { useState, useEffect } from "react";
import "./Report.css";
import axios from "axios";
import { useUser } from "../User";

function Report({ onClose, id, report_type }) {
  const { user } = useUser();
  const [selectedReport, setSelectedReport] = useState(null);

  // ประเภทการรายงาน
  const reportTypes = [
    "เนื้อหาเกี่ยวกับเรื่องเพศ",
    "เนื้อหารุนแรงหรือน่ารังเกียจ",
    "เนื้อหาแสดงความเกลียดชังหรือการล่วงละเมิด",
    "การให้ข้อมูลที่ไม่ถูกต้อง",
    "สแปมหรือทำให้เข้าใจผิด",
  ];

  // Effect เพื่อจัดการ class ของ body เมื่อเปิด/ปิด Popup
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, []);

  // ฟังก์ชันสำหรับส่งรายงาน
  const reportSubmit = async () => {
    if (!selectedReport) return;

    const endpointMap = {
      review: `reportReview/${id}`,
      post: `reportPost/${id}`,
      comment: `reportComment/${id}`,
    };

    const endpoint = endpointMap[report_type];
    if (!endpoint) {
      alert("ประเภทการรายงานไม่ถูกต้อง");
      return;
    }

    try {
      await axios.post(`http://localhost:3000/${endpoint}`, {
        user_id: user.user_id,
        report_desc: selectedReport,
      });
      alert("รายงานถูกส่งเรียบร้อยแล้ว");
      onClose();
    } catch (error) {
      console.error("Error submitting report:", error);
      alert(`เกิดข้อผิดพลาดรายงาน${report_type}`);
    }
  };

  return (
    <div className="popup-page">
      <div className="report-container">
        <div className="report-header">
          <h3>รายงาน</h3>
          <i className="bx bx-x" onClick={onClose}></i>
        </div>
        <div className="report-content">
          {reportTypes.map((report, index) => (
            <label key={index} className="report-label">
              <input
                type="radio"
                name="reportType"
                value={report}
                onChange={(e) => setSelectedReport(e.target.value)}
              />
              <p>{report}</p>
            </label>
          ))}
        </div>
        <div className="submit-report-container">
          <button
            className="submit-report"
            disabled={!selectedReport}
            onClick={reportSubmit}
          >
            <h4>รายงาน</h4>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Report;
