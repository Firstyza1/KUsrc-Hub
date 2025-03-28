import { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import SideBar from "../SideBar/SideBar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../../components/UserContext/User";
function ManageReportReview() {
  const [reportedReviews, setReportedReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [actionType, setActionType] = useState("");
  const { user } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  // ดึงข้อมูลรายงานรีวิวจาก API
  useEffect(() => {
    fetchReportedReviews();
  }, []);

  const fetchReportedReviews = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/getAllReportedReview"
      );

      if (response.data.reported_review.length === 0) {
        setError("ไม่มีข้อมูล");
      } else {
        setReportedReviews(response.data.reported_review);
        setFilteredReviews(response.data.reported_review);
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

  // เปิด popup ยืนยันการดำเนินการ
  const openDeletePopup = (report, type) => {
    setSelectedReport(report);
    setActionType(type);
    setShowDeletePopup(true);
  };

  // ปิด popup
  const closeDeletePopup = () => {
    setShowDeletePopup(false);
    setSelectedReport(null);
    setActionType("");
  };

  // ดำเนินการอนุมัติหรือไม่อนุมัติ
  const handleConfirmAction = async () => {
    if (!selectedReport) return;

    try {
      if (actionType === "approve") {
        await axios.delete(
          `http://localhost:3000/deleteReview/${selectedReport.review_id}`,
          {
            headers: {
              authtoken: `Bearer ${user?.token}`,
            },
          }
        );
        setReportedReviews((prev) =>
          prev.filter((report) => report.review_id !== selectedReport.review_id)
        );
        setFilteredReviews((prev) =>
          prev.filter((report) => report.review_id !== selectedReport.review_id)
        );
        toast.success("ลบรีวิวสำเร็จ", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (actionType === "reject") {
        await axios.delete(
          `http://localhost:3000/deleteReportedReview/${selectedReport.report_id}`,
          {
            headers: {
              authtoken: `Bearer ${user?.token}`,
            },
          }
        );
        setReportedReviews((prev) =>
          prev.filter((report) => report.report_id !== selectedReport.report_id)
        );
        setFilteredReviews((prev) =>
          prev.filter((report) => report.report_id !== selectedReport.report_id)
        );
        toast.success("ลบรายงานรีวิวสำเร็จ", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      closeDeletePopup();
    } catch (error) {
      // console.error("Error processing request:", error);
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

  // การค้นหา
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchText(searchValue);

    const filteredData = reportedReviews.filter((report) => {
      return (
        report.report_id.toString().includes(searchValue) ||
        report.username.toLowerCase().includes(searchValue)
        // ||
        // report.review_desc.toLowerCase().includes(searchValue)
      );
    });
    setFilteredReviews(filteredData);
  };

  // กำหนดคอลัมน์ของ DataTable
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
      name: "รหัสคำร้อง",
      selector: (row) => row.report_id,
      sortable: true,
      width: "120px",
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
      name: "เนื้อหารีวิว",
      selector: (row) => row.review_desc,
      sortable: true,
      width: "460px",
    },
    {
      name: "เหตุผลที่แจ้ง",
      selector: (row) => row.report_desc,
      sortable: true,
      // width: "300px",
    },
    {
      name: "ผู้แจ้ง",
      selector: (row) => row.username,
      sortable: true,
      width: "170px",
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
          {/* <i
            className="bx bx-show"
            onClick={() => navigate(`/ViewReport/${row.report_id}`)}
          ></i> */}
          <i
            className="bx bx-x"
            onClick={() => openDeletePopup(row, "reject")}
          ></i>
          <i
            className="bx bx-check"
            onClick={() => openDeletePopup(row, "approve")}
          ></i>
        </div>
      ),
      ignoreRowClick: true,
    },
  ];

  return (
    <>
      <SideBar />
      {showDeletePopup && (
        <div className="deletePopupOverlay">
          <div className="deletePopup">
            <h3>
              คุณต้องการ {actionType === "approve" ? "อนุมัติ" : "ไม่อนุมัติ"}
              ลบรีวิวนี้ใช่ไหม?
            </h3>
            <p style={{ marginTop: "10px" }}>
              รหัสคำร้อง: {selectedReport?.report_id}
            </p>
            <div className="deletePopupButtons">
              <button onClick={closeDeletePopup} className="cancelButton">
                ยกเลิก
              </button>{" "}
              <button onClick={handleConfirmAction} className="confirmButton">
                ยืนยัน
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
                  placeholder="ค้นหาด้วยรหัสคำร้อง, หรือชื่อผู้แจ้ง"
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

export default ManageReportReview;
