import { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import SideBar from "../SideBar/SideBar";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../components/UserContext/User";
import { toast } from "react-toastify";
function ManageReportPost() {
  const [circleLoading, setCircleLoading] = useState(false);
  const [reportedPosts, setReportedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [actionType, setActionType] = useState("");
  const { user } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  // ดึงข้อมูลรายงานโพสต์จาก API
  useEffect(() => {
    fetchReportedPosts();
  }, []);

  const fetchReportedPosts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/getAllReportedPost"
      );
      if (response.data.reported_post.length === 0) {
        setError("ไม่มีข้อมูล");
      } else {
        setReportedPosts(response.data.reported_post);
        setFilteredPosts(response.data.reported_post);
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
    setCircleLoading(true);
    try {
      if (actionType === "approve") {
        await axios.delete(
          `http://localhost:3000/deletePost/${selectedReport.post_id}`,
          {
            headers: {
              authtoken: `Bearer ${user?.token}`,
            },
          }
        );
        setReportedPosts((prev) =>
          prev.filter((report) => report.post_id !== selectedReport.post_id)
        );
        setFilteredPosts((prev) =>
          prev.filter((report) => report.post_id !== selectedReport.post_id)
        );
        toast.success("ลบโพสต์สำเร็จ", {
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
          `http://localhost:3000/deleteReportedPost/${selectedReport.report_id}`,
          {
            headers: {
              authtoken: `Bearer ${user?.token}`,
            },
          }
        );
        setReportedPosts((prev) =>
          prev.filter((report) => report.report_id !== selectedReport.report_id)
        );
        setFilteredPosts((prev) =>
          prev.filter((report) => report.report_id !== selectedReport.report_id)
        );
        toast.success("ลบรายงานโพสต์สำเร็จ", {
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
      setCircleLoading(false);
    }
  };

  // การค้นหา
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchText(searchValue);

    const filteredData = reportedPosts.filter((report) => {
      return (
        report.report_id.toString().includes(searchValue) ||
        report.username.toLowerCase().includes(searchValue)
      );
    });
    setFilteredPosts(filteredData);
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
      name: "เนื้อหาโพสต์",
      selector: (row) => row.post_desc,
      sortable: true,
      width: "460px",
    },
    {
      name: "เหตุผลที่แจ้ง",
      selector: (row) => row.report_desc,
      sortable: true,
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
            onClick={() => navigate(`/Post/${row.post_id}`)}
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
            <h3>
              คุณต้องการ {actionType === "approve" ? "อนุมัติ" : "ไม่อนุมัติ"}
              ลบโพสต์นี้ใช่ไหม?
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
                    data={filteredPosts}
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

export default ManageReportPost;
