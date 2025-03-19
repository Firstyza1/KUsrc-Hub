import { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../SideBar/SideBar";
import { useNavigate } from "react-router-dom";
import "./ManageReportReview.css";

function ManageReportReview() {
  const [reportedReviews, setReportedReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [actionType, setActionType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    document.body.classList.add("no-padding");
    return () => {
      document.body.classList.remove("no-padding");
    };
  }, []);

  const reviewsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchReportedReviews();
  }, []);

  const fetchReportedReviews = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/getAllReportedReview"
      );
      if (response.data.reported_review.length === 0) {
        setErrorMessage("ไม่มีข้อมูลคำร้องรีวิว");
      } else {
        setReportedReviews(response.data.reported_review);
        setErrorMessage("");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage("ไม่มีข้อมูลคำร้องรีวิว");
      } else {
        setErrorMessage("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      }
      console.error("Error fetching reported reviews:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${
      date.getFullYear() + 543
    }`;
  };

  const openDeletePopup = (report, type) => {
    setSelectedReport(report);
    setActionType(type);
    setShowDeletePopup(true);
  };

  const closeDeletePopup = () => {
    setShowDeletePopup(false);
    setSelectedReport(null);
    setActionType("");
  };

  const handleConfirmAction = async () => {
    if (!selectedReport) return;

    try {
      if (actionType === "approve") {
        await axios.delete(
          `http://localhost:3000/deleteReview/${selectedReport.review_id}`
        );
        setReportedReviews((prev) =>
          prev.filter((report) => report.review_id !== selectedReport.review_id)
        );
      } else if (actionType === "reject") {
        await axios.delete(
          `http://localhost:3000/deleteReportedReview/${selectedReport.report_id}`
        );
        setReportedReviews((prev) =>
          prev.filter((report) => report.report_id !== selectedReport.report_id)
        );
      }
      closeDeletePopup();
    } catch (error) {
      console.error("Error processing request:", error);
    }
  };

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reportedReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );
  const totalPages = Math.ceil(reportedReviews.length / reviewsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <SideBar />
      <div className="manage-report-review-page">
        <div className="manage-report-review-header">
          <p>จัดการคำร้องรีวิว</p>
          <div className="admin-profile"></div>
        </div>

        <div className="search-report-review-container">
          <div className="input-search-report-review">
            <input
              type="text"
              placeholder="ค้นหาด้วยชื่อผู้แจ้ง"
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

        <div className="report-review-table-container">
          <table>
            <thead>
              <tr>
                <th>รหัสคำร้อง</th>
                <th>เนื้อหาคอมเมนต์</th>
                <th>รายละเอียด</th>
                <th>ผู้แจ้ง</th>
                <th>วันที่</th>
                <th>การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {errorMessage ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "black",
                    }}
                  >
                    {errorMessage}
                  </td>
                </tr>
              ) : currentReviews.length > 0 ? (
                <>
                  {currentReviews.map((report) => (
                    <tr key={report.report_id}>
                      <td>{report.report_id}</td>
                      <td>{report.review_desc}</td>
                      <td>{report.report_desc}</td>
                      <td>{report.username}</td>
                      <td>{formatDate(report.created_at)}</td>
                      <td>
                        <div className="report-review-button-container">
                          <button className="show-button">
                            <i className="bx bx-show"></i> ดู
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => openDeletePopup(report, "reject")}
                          >
                            ไม่อนุมัติ
                          </button>
                          <button
                            className="accept-button"
                            onClick={() => openDeletePopup(report, "approve")}
                          >
                            อนุมัติ
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
            disabled={currentPage === 1 || reportedReviews.length === 0}
            className={
              currentPage === 1 || reportedReviews.length === 0
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
            disabled={currentPage === totalPages || reportedReviews.length === 0}
            className={
              currentPage === totalPages || reportedReviews.length === 0
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
            <h3>
              คุณต้องการ {actionType === "approve" ? "อนุมัติ" : "ไม่อนุมัติ"}{" "}
              ลบรีวิวนี้ใช่ไหม?
            </h3>
            <p>
              เนื้อหา: <strong>{selectedReport?.comment_desc}</strong>
            </p>
            <div className="popup-buttons">
              <button
                className="cancel-popup-button"
                onClick={closeDeletePopup}
              >
                ยกเลิก
              </button>
              <button className="approve-button" onClick={handleConfirmAction}>
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ManageReportReview;
