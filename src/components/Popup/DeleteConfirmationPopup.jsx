import React, { useEffect } from "react";
import axios from "axios";
import "./DeleteConfirmationPopup.css";

const DeleteConfirmationPopup = ({
  message,
  onConfirm,
  onCancel,
  type,
  id,
}) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  const handleDelete = async () => {
    try {
      let endpoint;
      if (type === "post") {
        endpoint = `deletePost/${id}`;
      } else if (type === "comment") {
        endpoint = `deleteComment/${id}`;
      } else if (type === "review") {
        endpoint = `deleteReview/${id}`;
      } else {
        alert("ประเภทไม่ถูกต้อง");
        return;
      }

      await axios.delete(`http://localhost:3000/${endpoint}`);
      alert("ลบข้อมูลเรียบร้อยแล้ว");
      onConfirm();
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการลบข้อมูล:", error);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  return (
    <div className="deletePopupOverlay">
      <div className="deletePopup">
        <h3>{message}</h3>
        <div className="deletePopupButtons">
          <button onClick={handleDelete} className="confirmButton">
            ลบ
          </button>
          <button onClick={onCancel} className="cancelButton">
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationPopup;
