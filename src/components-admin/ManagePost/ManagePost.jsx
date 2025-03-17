import { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../SideBar/SideBar";
import { useNavigate } from "react-router-dom";
import "./ManagePost.css";

function ManagePost() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  
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

  const subjectsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getPost");
      if (response.data.posts.length === 0) {
        setErrorMessage("ไม่มีข้อมูลโพสต์");
      } else {
        setPosts(response.data.posts);
        setErrorMessage("");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage("ไม่มีข้อมูลโพสต์");
      } else {
        setErrorMessage("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      }
      console.error("Error fetching posts:", error);
    }
  };

 
  const openDeletePopup = (post) => {
    setSelectedPost(post);
    setShowDeletePopup(true);
  };

  const closeDeletePopup = () => {
    setShowDeletePopup(false);
    setSelectedPost(null);
  };

  const handleDeletePost = async () => {
    if (!selectedPost) return;
    try {
      await axios.delete(`http://localhost:3000/deletePost/${selectedPost.post_id}`);
      const updatedPosts = posts.filter((post) => post.post_id !== selectedPost.post_id);
      setPosts(updatedPosts);

      if (updatedPosts.slice(indexOfFirstPost, indexOfLastPost).length === 0 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }

      closeDeletePopup();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const indexOfLastPost = currentPage * subjectsPerPage;
  const indexOfFirstPost = indexOfLastPost - subjectsPerPage;
  const currentPosts = posts.slice(
    indexOfFirstPost,
    indexOfLastPost
  );
  const totalPages = Math.ceil(posts.length / subjectsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <SideBar />
      <div className="manage-post-page">
        <div className="manage-post-header">
          <p>จัดการโพสต์</p>
          <div className="admin-profile"></div>
        </div>

        <div className="search-post-container">
          <div className="input-search-post">
            <input
              type="text"
              placeholder="ค้นหาด้วยชื่อผู้เขียน/วันที่"
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

        <div className="post-table-container">
          <table>
          <thead>
              <tr>
                <th>รหัสโพสต์</th>
                <th>เนื้อหา</th>
                <th>วันที่สร้าง</th>
                <th>ผู้เขียน</th>
                <th>จำนวนความคิดเห็น</th>
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
              ) : currentPosts.length > 0 ? (
                <>
                  {currentPosts.map((post) => (
                <tr key={post.post_id}>
                  <td>{post.post_id}</td>
                  <td>{post.post_desc}</td>
                  <td>{formatDate(post.created_at)}</td>
                  <td>{post.username}</td>
                  <td>{post.comment_count}</td>
                  <td>
                    <div className="post-button-container">
                      <button className="show-button">
                        <i className="bx bx-show"></i> ดู
                      </button>
                      <button className="delete-button" onClick={() => openDeletePopup(post)}>
                        <i className="bx bx-trash"></i> ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

                  {/* 🔹 เติมแถวว่างให้ครบ 5 แถว */}
                  {Array.from({
                    length: subjectsPerPage - currentPosts.length,
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
            disabled={currentPage === 1 || posts.length === 0}
            className={
              currentPage === 1 || posts.length === 0
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
            disabled={currentPage === totalPages || posts.length === 0}
            className={
              currentPage === totalPages || posts.length === 0
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
            <h3>คุณต้องการลบโพสต์นี้ใช่ไหม?</h3>
            <p>ชื่อโพสต์: <strong>{selectedPost?.subject_thai}</strong></p>
            <div className="popup-buttons">
              <button className="cancel-popup-button" onClick={closeDeletePopup}>ยกเลิก</button>
              <button className="confirm-button" onClick={handleDeletePost}>ยืนยัน</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ManagePost;
