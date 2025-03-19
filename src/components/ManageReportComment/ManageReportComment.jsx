import { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../SideBar/SideBar";
import { useNavigate } from "react-router-dom";
import "./ManageReportComment.css";

function ManageReportComment() {
  const [reportedComments, setReportedComments] = useState([]);
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

  const commentsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchReportedComments();
  }, []);

  const fetchReportedComments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/getAllReportedComment"
      );
      if (response.data.reported_comment.length === 0) {
        setErrorMessage("ไม่มีข้อมูลคำร้องความคิดเห็น");
      } else {
        setReportedComments(response.data.reported_comment);
        setErrorMessage("");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage("ไม่มีข้อมูลคำร้องความคิดเห็น");
      } else {
        setErrorMessage("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      }
      console.error("Error fetching reported comments:", error);
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
          `http://localhost:3000/deleteComment/${selectedReport.comment_id}`
        );
        setReportedComments((prev) =>
          prev.filter((c) => c.comment_id !== selectedReport.comment_id)
        );
      } else if (actionType === "reject") {
        await axios.delete(
          `http://localhost:3000/deleteReportedComment/${selectedReport.report_id}`
        );
        setReportedComments((prev) =>
          prev.filter((c) => c.report_id !== selectedReport.report_id)
        );
      }
      closeDeletePopup();
    } catch (error) {
      console.error("Error processing request:", error);
    }
  };

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = reportedComments.slice(
    indexOfFirstComment,
    indexOfLastComment
  );
  const totalPages = Math.ceil(reportedComments.length / commentsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <SideBar />
      <div className="manage-report-comment-page">
        <div className="manage-report-comment-header">
          <p>จัดการคำร้องคอมเมนต์</p>
          <div className="admin-profile"></div>
        </div>

        <div className="search-report-comment-container">
          <div className="input-search-report-comment">
            <input
              type="text"
              placeholder="ค้นหาด้วยชื่อผู้แจ้ง"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button
              className="search-icon-post"
              onClick={() => setSearchText("")}
            >
              <i className={searchText ? "bx bx-x" : "bx bx-search"}></i>
            </button>
          </div>
        </div>

        <div className="report-comment-table-container">
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
              ) : currentComments.length > 0 ? (
                <>
                  {currentComments.map((report) => (
                    <tr key={report.report_id}>
                      <td>{report.report_id}</td>
                      <td>{report.comment_desc}</td>
                      <td>{report.report_desc}</td>
                      <td>{report.username}</td>
                      <td>{formatDate(report.created_at)}</td>
                      <td>
                        <div className="report-comment-button-container">
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
                    length: commentsPerPage - currentComments.length,
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
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1 || reportedComments.length === 0} className={currentPage === 1 || reportedComments.length === 0 ? "prev-next-button disabled" : "prev-next-button"}>
            <i className="bx bx-chevron-left"></i>
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i + 1} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? "active" : ""}>{i + 1}</button>
          ))}
          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages || reportedComments.length === 0} className={currentPage === totalPages || reportedComments.length === 0 ? "prev-next-button disabled" : "prev-next-button"}>
            <i className="bx bx-chevron-right"></i>
          </button>
        </div>
      </div>

      {showDeletePopup && (
        <div className="delete-popup-overlay">
          <div className="delete-popup">
            <h3>
              คุณต้องการ {actionType === "approve" ? "อนุมัติ" : "ไม่อนุมัติ"}{" "}
              ลบคอมเมนต์นี้ใช่ไหม?
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

export default ManageReportComment;
