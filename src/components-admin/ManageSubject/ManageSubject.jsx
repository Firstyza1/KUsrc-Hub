import { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../SideBar/SideBar";
import { useNavigate } from "react-router-dom";
import "./ManageSubject.css";

function ManageSubject() {
  const [subjects, setSubjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    document.body.classList.add("no-padding");
    return () => {
      document.body.classList.remove("no-padding");
    };
  }, []);

  const subjectsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get("http://localhost:3000/Subjects");

      if (response.data.subjects.length === 0) {
        setErrorMessage("ไม่มีวิชาในระบบ");
      } else {
        setSubjects(response.data.subjects);
        setErrorMessage("");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage("ไม่มีวิชาในระบบ");
      } else {
        setErrorMessage("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      }
      console.error("Error fetching subjects:", error);
    }
  };

  const openDeletePopup = (user) => {
    setSelectedSubject(user);
    setShowDeletePopup(true);
  };

  const closeDeletePopup = () => {
    setSelectedSubject(null);
    setShowDeletePopup(false);
  };

  const handleDeleteSubject = async () => {
    if (!selectedSubject) return;
    try {
      await axios.delete(
        `http://localhost:3000/deleteSubject/${selectedSubject.subject_id}`
      );
      const updatedSubjects = subjects.filter(
        (subject) => subject.subject_id !== selectedSubject.subject_id
      );
      setSubjects(updatedSubjects);

      // ถ้าหลังจากลบแล้วไม่มีข้อมูลในหน้าปัจจุบัน → ย้อนกลับไปหน้าก่อนหน้า
      const remainingItemsOnPage = updatedSubjects.slice(
        indexOfFirstSubject,
        indexOfLastSubject
      ).length;
      if (remainingItemsOnPage === 0 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }

      closeDeletePopup();
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
  };

  const indexOfLastSubject = currentPage * subjectsPerPage;
  const indexOfFirstSubject = indexOfLastSubject - subjectsPerPage;
  const currentSubjects = subjects.slice(
    indexOfFirstSubject,
    indexOfLastSubject
  );
  const totalPages = Math.ceil(subjects.length / subjectsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <SideBar />
      <div className="manage-subject-page">
        <div className="manage-subject-header">
          <p>จัดการรายวิชา</p>
          <div className="admin-profile"></div>
        </div>

        <div className="search-subject-container">
          <div className="input-search-subject">
            <input
              type="text"
              placeholder="ค้นหาด้วยรหัสวิชา/ชื่อวิชา"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button
              className="search-icon-subject"
              onClick={() => setSearchText("")}
            >
              <i className={searchText ? "bx bx-x" : "bx bx-search"}></i>
            </button>
          </div>
        </div>

        <div className="subject-table-container">
          <table>
            <thead>
              <tr>
                {/* <th>ลำดับที่</th> */}
                <th>รหัสวิชา</th>
                <th>ชื่อวิชา (ไทย)</th>
                <th>ชื่อวิชา (อังกฤษ)</th>
                <th>หน่วยกิต</th>
                <th>หมวดหมู่</th>
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
              ) : currentSubjects.length > 0 ? (
                <>
                  {currentSubjects.map((subject, index) => (
                    <tr key={subject.subject_id}>
                      {/* <td>{index + indexOfFirstSubject + 1}</td> */}
                      <td>{subject.subject_id}</td>
                      <td>{subject.subject_thai}</td>
                      <td>{subject.subject_eng}</td>
                      <td>{subject.credit}</td>
                      <td>{subject.category_thai}</td>
                      <td>
                        <div className="subject-button-container">
                          <button
                            className="edit-button"
                            onClick={() =>
                              navigate(
                                `/EditSubjectAdmin/${subject.subject_id}`
                              )
                            }
                          >
                            <i className="bx bx-edit"></i> แก้ไข
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => openDeletePopup(subject)}
                          >
                            <i className="bx bx-trash"></i> ลบ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* 🔹 เติมแถวว่างให้ครบ 5 แถว */}
                  {Array.from({
                    length: subjectsPerPage - currentSubjects.length,
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
            disabled={currentPage === 1 || subjects.length === 0}
            className={
              currentPage === 1 || subjects.length === 0
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
            disabled={currentPage === totalPages || subjects.length === 0}
            className={
              currentPage === totalPages || subjects.length === 0
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
            <h3>คุณต้องการลบรายวิชานี้ใช่ไหม?</h3>
            <p>
              ชื่อวิชา: <strong>{selectedSubject?.subject_thai}</strong>
            </p>
            <div className="popup-buttons">
              <button
                className="cancel-popup-button"
                onClick={closeDeletePopup}
              >
                ยกเลิก
              </button>
              <button className="confirm-button" onClick={handleDeleteSubject}>
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ManageSubject;
