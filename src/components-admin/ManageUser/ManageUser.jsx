import { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../SideBar/SideBar";
import { useNavigate } from "react-router-dom";
import "./ManageUser.css";

function ManageUser() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    document.body.classList.add("no-padding");
    return () => {
      document.body.classList.remove("no-padding");
    };
  }, []);

  const usersPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/getUser"
      );
      if (response.data.users.length === 0) {
        setErrorMessage("ไม่มีผู้ใช้");
      } else {
        setUsers(response.data.users);
        setErrorMessage("");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage("ไม่มีผู้ใช้");
      } else {
        setErrorMessage("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      }
      console.error("Error fetching users:", error);
    }
  };

 
  const openDeletePopup = (user) => {
    setSelectedUser(user);
    setShowDeletePopup(true);
  };

  const closeDeletePopup = () => {
    setSelectedUser(null);
    setShowDeletePopup(false);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await axios.delete(`http://localhost:3000/deleteUser/${selectedUser.user_id}`);
      setUsers(users.filter((user) => user.user_id !== selectedUser.user_id));
      closeDeletePopup();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(
    indexOfFirstUser,
    indexOfLastUser
  );
  const totalPages = Math.ceil(users.length / usersPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${
      date.getFullYear() + 543
    }`;
  };
  return (
    <>
      <SideBar />
      <div className="manage-user-page">
        <div className="manage-user-header">
          <p>จัดการผู้ใช้</p>
          <div className="admin-profile"></div>
        </div>

        <div className="search-user-container">
          <div className="input-search-user">
            <input
              type="text"
              placeholder="ค้นหาด้วยชื่อผู้ใช้/รหัสผู้ใช้"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button
              className="search-icon"
              onClick={() => setSearchText("")}
            >
              <i className={searchText ? "bx bx-x" : "bx bx-search"}></i>
            </button>
          </div>
        </div>

        <div className="table-container">
          <table>
          <thead>
              <tr>
                {/* <th>ลำดับที่</th> */}
                <th>รหัสผู้ใช้</th>
                <th>รูปโปรไฟล์ผู้ใช้</th>
                <th>ชื่อผู้ใช้</th>
                <th>อีเมล</th>
                <th>วันที่สร้าง</th>
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
              ) : currentUsers.length > 0 ? (
                <>
                  {currentUsers.map((user, index) => (
                <tr key={user.user_id}>
                  {/* <td>{index + indexOfFirstUser + 1}</td> */}
                  <td>{user.user_id}</td>
                  <td>
                    <img src={user.user_profile || "https://i.pinimg.com/736x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"} alt="Profile" className="profile-img" />
                  </td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{formatDate(user.created_at)}</td>
                  <td>
                    <div className="user-button-container">
                      <button className="edit-button" onClick={() => navigate(`/EditProfileAdmin/${user.user_id}`)}>
                        <i className="bx bx-edit"></i> แก้ไข
                      </button>
                      <button className="delete-button" onClick={() => openDeletePopup(user)}>
                        <i className="bx bx-trash"></i> ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

                  {/* 🔹 เติมแถวว่างให้ครบ 5 แถว */}
                  {Array.from({
                    length: usersPerPage - currentUsers.length,
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
            disabled={currentPage === 1 || users.length === 0}
            className={
              currentPage === 1 || users.length === 0
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
            disabled={currentPage === totalPages || users.length === 0}
            className={
              currentPage === totalPages || users.length === 0
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
            <h3>คุณต้องการลบผู้ใช้รายนี้ใช่ไหม?</h3>
            <p>ชื่อผู้ใช้: <strong>{selectedUser?.username}</strong></p>
            <div className="popup-buttons">
              <button className="cancel-popup-button" onClick={closeDeletePopup}>ยกเลิก</button>
              <button className="confirm-button" onClick={handleDeleteUser}>ยืนยัน</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ManageUser;
