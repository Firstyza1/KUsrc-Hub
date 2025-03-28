import { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import SideBar from "../SideBar/SideBar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../../components/UserContext/User";
function ManageUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { user } = useUser();
  // ดึงข้อมูลผู้ใช้จาก API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getUser");

      if (response.data.users.length === 0) {
        setError("ไม่มีข้อมูล");
      } else {
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
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

    const filteredData = users.filter((user) => {
      return (
        user.user_id.toString().includes(searchValue) ||
        user.username.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue) // เพิ่มการค้นหาด้วยอีเมล
      );
    });
    setFilteredUsers(filteredData);
  };

  // การลบผู้ใช้
  const openDeletePopup = (user) => {
    setSelectedUser(user);
    setShowDeletePopup(true);
  };

  const closeDeletePopup = () => {
    setShowDeletePopup(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await axios.delete(
        `http://localhost:3000/deleteUser/${selectedUser.user_id}`,
        {
          headers: {
            authtoken: `Bearer ${user?.token}`,
          },
        }
      );
      const updatedUsers = users.filter(
        (user) => user.user_id !== selectedUser.user_id
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      closeDeletePopup();
      toast.success("ลบผู้ใช้สำเร็จ", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      // console.error("Error deleting user:", error);
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
      name: "รหัสผู้ใช้",
      selector: (row) => row.user_id,
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
      name: "รูปโปรไฟล์",
      width: "96px",
      cell: (row) => (
        <img
          src={row.user_profile}
          alt="Profile"
          className="profile-img"
          style={{ width: "38px", height: "38px", borderRadius: "50%" }}
        />
      ),
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
      name: "ชื่อผู้ใช้",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "อีเมล",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "บทบาท",
      selector: (row) => row.role,
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
            onClick={() => navigate(`/EditProfileAdmin/${row.user_id}`)}
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
      {showDeletePopup && (
        <div className="deletePopupOverlay">
          <div className="deletePopup">
            <h3>คุณต้องการลบผู้ใช้รายนี้ใช่ไหม?</h3>
            <p style={{ marginTop: "10px" }}>
              ชื่อผู้ใช้: {selectedUser?.username}
            </p>
            <div className="deletePopupButtons">
              <button onClick={closeDeletePopup} className="cancelButton">
                ยกเลิก
              </button>{" "}
              <button onClick={handleDeleteUser} className="confirmButton">
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
                  placeholder="ค้นหาด้วยชื่อผู้ใช้, รหัสผู้ใช้, หรืออีเมล"
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
                    data={filteredUsers}
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

export default ManageUser;
