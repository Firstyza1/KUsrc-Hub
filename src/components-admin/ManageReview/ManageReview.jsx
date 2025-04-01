import { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import SideBar from "../SideBar/SideBar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../../components/UserContext/User";
function ManageReview() {
  const [circleLoading, setCircleLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const navigate = useNavigate();
  const { user } = useUser();
  // ฟังก์ชันจัดรูปแบบวันที่

  // ดึงข้อมูลรีวิวจาก API
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getAllReview");
      if (response.data.reviews.length === 0) {
        setErrorMessage("ไม่มีข้อมูล");
      } else {
        setReviews(response.data.reviews);
        setFilteredReviews(response.data.reviews);
      }
    } catch (error) {
      if (error.response.status) {
        {
          setError(`เกิดข้อผิดพลาด: ${error.response.status}`);
        }
      } else {
        setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
      }
    } finally {
      setLoading(false);
    }
  };

  // การค้นหา
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchText(searchValue);

    const filteredData = reviews.filter((review) => {
      return (
        review.review_id.toString().includes(searchValue) ||
        review.username.toLowerCase().includes(searchValue) ||
        review.subject_id.toString().includes(searchValue)
      );
    });
    setFilteredReviews(filteredData);
  };

  // การลบรีวิว
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
    setCircleLoading(true);
    try {
      await axios.delete(
        `http://localhost:3000/deleteReview/${selectedReview.review_id}`,
        {
          headers: {
            authtoken: `Bearer ${user?.token}`,
          },
        }
      );
      const updatedReviews = reviews.filter(
        (review) => review.review_id !== selectedReview.review_id
      );
      setReviews(updatedReviews);
      setFilteredReviews(updatedReviews);
      closeDeletePopup();
      toast.success("ลบข้อมูลสำเร็จ", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("Error deleting review:", error);
    } finally {
      setCircleLoading(false);
    }
  };

  const columns = [
    {
      name: "ลำดับ",
      selector: (row, index) => index + 1,
      width: "65px",
      sortable: false,
      conditionalCellStyles: [
        {
          when: (row) => true,
          style: {
            display: "flex",
            justifyContent: "center",
          },
        },
      ],
    },
    {
      name: "รหัสรีวิว",
      selector: (row) => row.review_id,
      sortable: true,
      // width: "100px",
      conditionalCellStyles: [
        {
          when: (row) => true,
          style: {
            display: "flex",
            justifyContent: "center",
          },
        },
      ],
    },
    {
      name: "รหัสวิชา",
      selector: (row) => row.subject_id,
      sortable: true,
      // width: "100px",
      conditionalCellStyles: [
        {
          when: (row) => true,
          style: {
            display: "flex",
            justifyContent: "center",
          },
        },
      ],
    },
    {
      name: "เนื้อหา",
      selector: (row) => row.review_desc,
      sortable: true,
      width: "460px",
    },

    {
      name: "ไฟล์ PDF",
      cell: (row) =>
        row.pdf_path ? (
          <a href={row.pdf_path} target="_blank" rel="noopener noreferrer">
            <i
              className="bx bxs-file-pdf"
              style={{ fontSize: "27px", color: "red", cursor: "pointer" }}
            ></i>
          </a>
        ) : (
          "-"
        ),
      width: "100px",
      conditionalCellStyles: [
        {
          when: (row) => true,
          style: {
            display: "flex",
            justifyContent: "center",
          },
        },
      ],
    },
    {
      name: "ผู้เขียน",
      selector: (row) => row.username,
      sortable: true,
      width: "160px",
    },
    {
      name: "วันที่สร้าง",
      selector: (row) =>
        new Date(row.created_at).toLocaleDateString("th-TH", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      sortable: true,
      width: "130px",
      conditionalCellStyles: [
        {
          when: (row) => true,
          style: {
            display: "flex",
            justifyContent: "center",
          },
        },
      ],
    },
    {
      name: "การดำเนินการ",
      width: "110px",
      cell: (row) => (
        <div className="action-button">
          <i
            className="bx bx-show"
            onClick={() => navigate(`/Subjects/${row.subject_id}`)}
          ></i>
          <i className="bx bx-trash" onClick={() => openDeletePopup(row)}></i>
        </div>
      ),
      ignoreRowClick: true,
    },
  ];

  return (
    <>
      <SideBar />
      {circleLoading && (
        <div className="loader-overlay">
          <div className="loader">
            <i class="bx bx-loader-circle bx-spin bx-rotate-90"></i>
          </div>
        </div>
      )}
      {showDeletePopup && (
        <div className="deletePopupOverlay">
          <div className="deletePopup">
            <h3>คุณต้องการลบรีวิวนี้หรือไม่?</h3>
            <p
              style={{ marginTop: "10px" }}
            >{`รหัสรีวิว: ${selectedReview?.review_id}`}</p>
            <div className="deletePopupButtons">
              <button onClick={closeDeletePopup} className="cancelButton">
                ยกเลิก
              </button>{" "}
              <button onClick={handleDeleteReview} className="confirmButton">
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="manage-data-page">
        <div className="manage-data-container">
          <div className="table-wrapper">
            <div className="table-header">
              <div className="table-search">
                <i className="bx bx-search"></i>
                <input
                  type="text"
                  placeholder="ค้นหาด้วย รหัสรีวิว, รหัสวิชา, หรือชื่อผู้เขียน"
                  value={searchText}
                  onChange={handleSearch}
                  className="search-input"
                />
              </div>
            </div>

            {loading ? (
              <div className="no-data-message">กำลังโหลด...</div>
            ) : (
              <>
                {error ? (
                  <div className="no-data-message">{error}</div>
                ) : (
                  <DataTable
                    columns={columns}
                    data={filteredReviews}
                    pagination
                    highlightOnHover
                    responsive
                    striped
                    defaultSortFieldId={1}
                    noDataComponent={
                      <div className="no-data-message">ไม่พบข้อมูล</div>
                    }
                    customStyles={{
                      table: {
                        style: {
                          border: "1px solid #ccc", // เส้นขอบรอบตาราง
                        },
                      },
                      headCells: {
                        style: {
                          backgroundColor: "white",
                          color: "black",
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                          boxShadow: "0 6px 6px -5px #e1e5ee;",
                          // border: "1px solid #ddd", // เส้นแบ่งระหว่างหัวคอลัมน์
                        },
                      },
                      cells: {
                        style: {
                          // borderRight: "1px solid #ddd", // เส้นแบ่งระหว่างเซลล์
                        },
                      },
                      rows: {
                        stripedStyle: {
                          backgroundColor: "#f4f6fb", // สีพื้นหลังสำหรับแถวสลับ
                        },
                      },
                    }}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ManageReview;
