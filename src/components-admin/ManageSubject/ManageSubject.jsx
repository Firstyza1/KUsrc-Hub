import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import "../Manage.css"; // นำเข้าไฟล์ CSS
import SideBar from "../SideBar/SideBar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../../components/UserContext/User";
const ManageSubject = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const navigate = useNavigate();
  const { user } = useUser();
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/Subjects");
      if (response.data.subjects.length === 0) {
        setErrorMessage("ไม่มีข้อมูล");
      } else {
        setSubjects(response.data.subjects);
        setFilteredSubjects(response.data.subjects);
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

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchText(searchValue);

    const filteredData = subjects.filter((subject) => {
      return (
        subject.subject_id.toLowerCase().includes(searchValue) ||
        subject.subject_thai.toLowerCase().includes(searchValue) ||
        subject.subject_eng.toLowerCase().includes(searchValue)
      );
    });
    setFilteredSubjects(filteredData);
  };

  const handleDeleteClick = (SubjectId) => {
    setSelectedSubjectId(SubjectId);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/deleteSubject/${selectedSubjectId}`,
        {
          headers: {
            authtoken: `Bearer ${user?.token}`,
          },
        }
      );
      // console.log("Deleted subject with ID:", selectedSubjectId);
      await fetchData();
      setShowDeletePopup(false);
      toast.success("ลบข้อมูลรายวิชาสำเร็จ", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error deleting subject:", error);
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
      name: "รหัสวิชา",
      selector: (row) => row.subject_id,
      sortable: true,
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
      name: "ชื่อวิชาภาไทย",
      selector: (row) => row.subject_thai,
      sortable: true,
      cell: (row) => <div className="table-cell">{row.subject_thai}</div>,
    },
    {
      name: "ชื่อวิชาภาษาอังกฤษ",
      selector: (row) => row.subject_eng,
      sortable: true,
      cell: (row) => <div className="table-cell">{row.subject_eng}</div>,
    },
    {
      name: "หน่วยกิต",
      selector: (row) => row.credit,
      sortable: true,
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
      name: "หมวดหมู่วิชา",
      selector: (row) => row.category_thai,
      sortable: true,
      cell: (row) => <div className="table-cell">{row.category_thai}</div>,
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
            className="bx bx-pencil"
            onClick={() => navigate(`/EditSubjectAdmin/${row.subject_id}`)}
          ></i>
          <i
            className="bx bx-trash"
            onClick={() => handleDeleteClick(row.subject_id, "subject")}
          ></i>
        </div>
      ),
      ignoreRowClick: true,
      // allowOverflow: true,
      // button: true,
    },
  ];

  // if (loading) {
  //   return <div>กำลังโหลด..</div>;
  // }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  return (
    <>
      <SideBar />
      {showDeletePopup && (
        <div className="deletePopupOverlay">
          <div className="deletePopup">
            <h3>คุณต้องการลบรายวิชานี้หรือไม่?</h3>
            <p
              style={{ marginTop: "10px" }}
            >{`รหัสวิชา: ${selectedSubjectId}`}</p>
            <div className="deletePopupButtons">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="cancelButton"
              >
                ยกเลิก
              </button>{" "}
              <button onClick={handleConfirmDelete} className="confirmButton">
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
              {/* <h4 className="table-title">ตารางข้อมูลรายวิชา</h4> */}
              <div className="table-search">
                <i className="bx bx-search"></i>
                <input
                  type="text"
                  placeholder="ค้นหาด้วยชื่อรหัสวิชา, ชื่อวิชาภาษาไทย, ชื่อวิชาภาษาอังกฤษ"
                  value={searchText}
                  onChange={handleSearch}
                  className="search-input"
                />
              </div>{" "}
              <div className="action-button">
                <i
                  className="bx bx-plus"
                  onClick={() => navigate(`/CreateSubject`)}
                >
                  <p>เพิ่มรายวิชา</p>
                </i>
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
                    data={filteredSubjects}
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
};

export default ManageSubject;
