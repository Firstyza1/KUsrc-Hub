import { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../SideBar/SideBar";
import { useNavigate } from "react-router-dom";
import "./ManageReview.css";

function ManageReview() {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  
  const [errorMessage, setErrorMessage] = useState("");
  const formatDate = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() + 543;
    return `${day}/${month}/${year}`;
  };
  useEffect(() => {
    document.body.classList.add("no-padding");
    return () => {
      document.body.classList.remove("no-padding");
    };
  }, []);

  const reviewsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getAllReview");
      if (response.data.reviews.length === 0) {
        setErrorMessage("ไม่มีข้อมูลรีวิว");
      } else {
        setReviews(response.data.reviews);
        setErrorMessage("");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage("ไม่มีข้อมูลรีวิวรายวิชา");
      } else {
        setErrorMessage("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      }
      console.error("Error fetching reviews:", error);
    }
  };

 
  const openDeletePopup = (review) => {
    setSelectedReview(review);
    setShowDeletePopup(true);
  };

  const closeDeletePopup = () => {
    setShowDeletePopup(false);
    setSelectedReview(null);
  };

  const handleDeleteReview = async () => {
    if (!selectedReview) return;
    try {
      await axios.delete(`http://localhost:3000/deleteReview/${selectedReview.review_id}`);
      const updatedReviews = reviews.filter(review => review.review_id !== selectedReview.review_id);
      setReviews(updatedReviews);

      if (updatedReviews.slice(indexOfFirstReview, indexOfLastReview).length === 0 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }

      closeDeletePopup();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <SideBar />
      <div className="manage-review-page">
        <div className="manage-review-header">
          <p>จัดการรีวิว</p>
          <div className="admin-profile"></div>
        </div>

        <div className="search-review-container">
          <div className="input-search-review">
            <input
              type="text"
              placeholder="ค้นหาด้วยชื่อผู้เขียน/วันที่"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button
              className="search-icon-review"
              onClick={() => setSearchText("")}
            >
              <i className={searchText ? "bx bx-x" : "bx bx-search"}></i>
            </button>
          </div>
        </div>

        <div className="review-table-container">
          <table>
          <thead>
              <tr>
                <th>รหัสรีวิว</th>
                <th>รหัสรายวิชา</th>
                <th>เนื้อหา</th>
                <th>วันที่</th>
                <th>ผู้เขียน</th>
                <th>ไฟล์ PDF</th>
                <th>การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {errorMessage ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "100px",
                      color: "black",
                    }}
                  >
                    {errorMessage}
                  </td>
                </tr>
              ) : currentReviews.length > 0 ? (
                <>
                  {currentReviews.map((review) => (
                <tr key={review.review_id}>
                  <td>{review.review_id}</td>
                  <td>{review.subject_id}</td>
                  <td>{review.review_desc}</td>
                  <td>{formatDate(review.created_at)}</td>
                  <td>{review.username}</td>
                  <td>
                    {review.pdf_path && (
                      <a href={review.pdf_path} target="_blank" rel="noopener noreferrer">เปิดไฟล์</a>
                    )}
                  </td>
                  <td>
                  <div className="subject-button-container">
                      <button className="show-button">
                        <i className="bx bx-show"></i> ดู
                      </button>
                      <button className="delete-button" onClick={() => openDeletePopup(review)}>
                        <i className="bx bx-trash"></i> ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

                  {/* 🔹 เติมแถวว่างให้ครบ 5 แถว */}
                  {Array.from({
                    length: reviewsPerPage - currentReviews.length,
                  }).map((_, i) => (
                    <tr
                      key={`empty-${i}`}
                      style={{ height: "70px", backgroundColor: "#fff" }}
                    >
                      <td colSpan="6"></td>
                    </tr>
                  ))}
                </>
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "gray",
                    }}
                  >
                    ไม่มีข้อมูล
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1 || reviews.length === 0}
            className={
              currentPage === 1 || reviews.length === 0
                ? "prev-next-button disabled"
                : "prev-next-button"
            }
          >
            <i className="bx bx-chevron-left"></i>
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages || reviews.length === 0}
            className={
              currentPage === totalPages || reviews.length === 0
                ? "prev-next-button disabled"
                : "prev-next-button"
            }
          >
            <i className="bx bx-chevron-right"></i>
          </button>
        </div>
      </div>

      {showDeletePopup && (
        <div className="delete-popup-overlay">
          <div className="delete-popup">
            <h3>คุณต้องการลบรีวิวนี้ใช่ไหม?</h3>
            <p>เนื้อหา: <strong>{selectedReview?.review_desc}</strong></p>
            <div className="popup-buttons">
              <button className="cancel-popup-button" onClick={closeDeletePopup}>ยกเลิก</button>
              <button className="confirm-button" onClick={handleDeleteReview}>ยืนยัน</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ManageReview;
