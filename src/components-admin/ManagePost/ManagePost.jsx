import { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import SideBar from "../SideBar/SideBar";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../components/UserContext/User";
import { toast } from "react-toastify";
function ManagePost() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate = useNavigate();
  const { user } = useUser();
  // Fetch posts from API
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getAllPost");

      if (response.data.length === 0) {
        setError("ไม่มีข้อมูล");
      } else {
        setPosts(response.data);
        setFilteredPosts(response.data);
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

  // Handle search
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchText(searchValue);

    const filteredData = posts.filter((post) => {
      return (
        post.post_id.toString().includes(searchValue) ||
        post.username.toLowerCase().includes(searchValue)
        //  ||
        // formatDate(post.created_at).includes(searchValue)
      );
    });
    setFilteredPosts(filteredData);
  };

  // Handle delete
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
      await axios.delete(
        `http://localhost:3000/deletePost/${selectedPost.post_id}`,
        {
          headers: {
            authtoken: `Bearer ${user?.token}`,
          },
        }
      );
      const updatedPosts = posts.filter(
        (post) => post.post_id !== selectedPost.post_id
      );
      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
      closeDeletePopup();
      toast.success("ลบโพสต์สำเร็จ", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      // console.error("Error deleting post:", error);
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

  // Define columns for DataTable
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
      name: "รหัสโพสต์",
      selector: (row) => row.post_id,
      sortable: true,
      width: "105px",
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
      selector: (row) => row.post_desc,
      sortable: true,
      width: "460px",
    },
    {
      name: "จำนวนดิสไลค์",
      selector: (row) => row.dislike_count,
      sortable: true,
      width: "125px",
      cell: (row) => <div className="table-cell">{row.dislike_count}</div>,
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
      name: "จำนวนไลค์",
      selector: (row) => row.like_count,
      sortable: true,
      // width: "115px",
      cell: (row) => <div className="table-cell">{row.like_count}</div>,
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
      name: "ความคิดเห็น",
      selector: (row) => row.comment_count,
      sortable: true,
      // width: "115px",
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
      cell: (row) => <div className="table-cell">{row.username}</div>,
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
            onClick={() => navigate(`/Post/${row.post_id}`)}
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
            <h3>คุณต้องการลบโพสต์นี้หรือไม่?</h3>
            <p
              style={{ marginTop: "10px" }}
            >{`รหัสโพสต์: ${selectedPost?.post_id}`}</p>
            <div className="deletePopupButtons">
              <button onClick={closeDeletePopup} className="cancelButton">
                ยกเลิก
              </button>{" "}
              <button onClick={handleDeletePost} className="confirmButton">
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
              {/* <h4 className="table-title">ตารางข้อมูลโพสต์</h4> */}
              <div className="table-search">
                <i className="bx bx-search"></i>
                <input
                  type="text"
                  placeholder="ค้นหาด้วยชื่อผู้เขียน"
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

export default ManagePost;
