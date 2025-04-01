import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DeleteConfirmationPopup.css";
import { useUser } from "../UserContext/User";
const DeleteConfirmationPopup = ({
  message,
  onConfirm,
  onCancel,
  type,
  id,
  refetch,
  showDeleteSuccessToast,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);
  const { user } = useUser();
  const handleDelete = async () => {
    setIsLoading(true);
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

      await axios.delete(`http://localhost:3000/${endpoint}`, {
        headers: {
          authtoken: `Bearer ${user?.token}`,
        },
      });
      // alert("ลบข้อมูลเรียบร้อยแล้ว");
      onConfirm();
      if (refetch) refetch();
      if (showDeleteSuccessToast) showDeleteSuccessToast();
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการลบข้อมูล:", error);
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
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="loader-overlay">
          <div className="loader">
            <i class="bx bx-loader-circle bx-spin bx-rotate-90"></i>
          </div>
        </div>
      )}
      <div className="deletePopupOverlay">
        <div className="deletePopup">
          <h3>{message}</h3>
          <div className="deletePopupButtons">
            <button onClick={onCancel} className="cancelButton">
              ยกเลิก
            </button>
            <button onClick={handleDelete} className="confirmButton">
              ลบ
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmationPopup;
