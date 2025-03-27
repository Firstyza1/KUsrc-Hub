import React, { useEffect } from "react";
import { toast } from "react-toastify";
const DeletePopup = ({ message, Data, onConfirm, onCancel, type, id }) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  const handleDelete = async () => {
    try {
      onConfirm(); // เรียก onConfirm เพียงครั้งเดียว
    } catch (error) {
      // console.error("เกิดข้อผิดพลาดในการลบข้อมูล:", error);
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
  };

  return (
    <div className="deletePopupOverlay">
      <div className="deletePopup">
        <h3>{message}</h3>
        {Data && <p style={{ marginTop: "10px" }}>{Data}</p>}
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

export default DeletePopup;
