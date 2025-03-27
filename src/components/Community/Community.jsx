import React, { useEffect, useState, useRef } from "react";
import Navbar from "../Navbar/Navbar";
import styles from "./Community.module.css";
import PostPopup from "./PostPopup";
import { useUser } from "../UserContext/User";
import axios from "axios";
import { useInfiniteQuery } from "react-query";
import InfiniteScroll from "react-infinite-scroller";
import Report from "../Popup/Report";
import { useNavigate } from "react-router-dom";
import Comment from "../Community/Comment";
import DeleteConfirmationPopup from "../Popup/DeleteConfirmationPopup";
import { toast } from "react-toastify";
import PopupLogin from "../Popup/PopupLogin";
function Community() {
  const [showPostPopup, setShowPostPopup] = useState(false);
  const { user } = useUser();
  const [activePopupId, setActivePopupId] = useState(null);
  const [reportPost, setReportPost] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [deleteType, setDeleteType] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const togglePopup = (postId) => {
    setActivePopupId(activePopupId === postId ? null : postId);
  };
  const [search, setSearch] = useState("");
  const sortOptions = [
    { value: "desc", label: "ใหม่ล่าสุด" },
    { value: "asc", label: "เก่าที่สุด" },
  ];
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchPosts = async ({ pageParam = 1 }) => {
    try {
      const params = {
        page: pageParam,
        limit: 5,
        sort: sortOrder,
      };
      if (search) {
        params.search = search;
      }
      if (user && user.user_id) {
        params.user_id = user.user_id;
      }
      const response = await axios.get("http://localhost:3000/getPost", {
        params,
      });

      return {
        results: response.data,
        nextPage: pageParam + 1,
        hasMore: response.data.length > 0,
      };
    } catch (error) {
      console.error("Error fetching posts:", error);
      return { results: [], nextPage: pageParam, hasMore: false };
    }
  };

  const { data, isLoading, isError, hasNextPage, fetchNextPage, refetch } =
    useInfiniteQuery(["posts", sortOrder, user?.user_id, search], fetchPosts, {
      getNextPageParam: (lastPage) => {
        return lastPage.hasMore ? lastPage.nextPage : undefined;
      },
    });

  const popupRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setActivePopupId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [postId, setPostId] = useState(null);
  const handleReport = (post_id) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    setPostId(post_id);
    setReportPost(true);
  };

  const handlePostPopup = (post_id) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    setPostId(post_id);
    setShowPostPopup(true);
  };

  const navigate = useNavigate();
  const goToPost = (post_id) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    navigate(`/Post/${post_id}`);
  };

  const handleDeleteClick = (id, type) => {
    setSelectedPostId(id);
    setDeleteType(type);
    setShowDeletePopup(true);
  };

  const handleCancelDelete = () => {
    setShowDeletePopup(false);
  };

  const postReaction = async (post_id, type) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    try {
      await axios.post(
        "http://localhost:3000/postReaction",
        {
          post_id: post_id,
          user_id: user.user_id,
          type: type,
        },
        {
          headers: {
            authtoken: `Bearer ${user?.token}`,
          },
        }
      );
      refetch();
    } catch (error) {
      // console.error("เกิดข้อผิดพลาด :", error);
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

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString); // แปลงวันที่สร้างโพสต์เป็น Date object
    const now = new Date(); // วันที่ปัจจุบัน
    const timeDifference = now - date; // ผลต่างเวลา (มิลลิวินาที)

    // แปลงผลต่างเวลาเป็นวินาที, นาที, ชั่วโมง, หรือวัน
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
      // หากเกิน 7 วัน ให้แสดงวันที่ในรูปแบบ "18 ม.ค. 2568"
      const thaiMonths = [
        "ม.ค.",
        "ก.พ.",
        "มี.ค.",
        "เม.ย.",
        "พ.ค.",
        "มิ.ย.",
        "ก.ค.",
        "ส.ค.",
        "ก.ย.",
        "ต.ค.",
        "พ.ย.",
        "ธ.ค.",
      ];
      const day = date.getDate();
      const month = thaiMonths[date.getMonth()];
      const year = date.getFullYear() + 543;
      return `${day} ${month} ${year}`;
    } else if (days > 0) {
      return `${days} วัน`;
    } else if (hours > 0) {
      return `${hours} ชั่วโมง`;
    } else if (minutes > 0) {
      return `${minutes} นาที`;
    } else {
      return `${seconds} วินาที`;
    }
  };

  const formatFullDate = (dateString) => {
    const date = new Date(dateString); // แปลงวันที่สร้างโพสต์เป็น Date object
    const thaiDays = [
      "อาทิตย์",
      "จันทร์",
      "อังคาร",
      "พุธ",
      "พฤหัสบดี",
      "ศุกร์",
      "เสาร์",
    ];
    const thaiMonths = [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ];

    const dayOfWeek = thaiDays[date.getDay()]; // วันในสัปดาห์ (อาทิตย์-เสาร์)
    const day = date.getDate(); // วันที่ (1-31)
    const month = thaiMonths[date.getMonth()]; // เดือน (ม.ค.-ธ.ค.)
    const year = date.getFullYear() + 543; // ปี พ.ศ.
    const hours = date.getHours().toString().padStart(2, "0"); // ชั่วโมง (00-23)
    const minutes = date.getMinutes().toString().padStart(2, "0"); // นาที (00-59)

    return `วัน${dayOfWeek}ที่ ${day} ${month} ${year} เวลา ${hours}.${minutes} น.`;
  };
  const showSuccessToast = () => {
    toast.success("เขียนโพสต์สำเร็จ", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const showDeleteSuccessToast = () => {
    toast.success("ลบโพสต์สำเร็จ", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const showReportToast = () => {
    toast.success("รายงานโพสต์สำเร็จ", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  return (
    <>
      <Navbar />
      <div className={styles.communityPage}>
        <div className={styles.communityContainer}>
          {showPostPopup && (
            <PostPopup
              post_id={postId}
              onClose={() => {
                setShowPostPopup(false);
                refetch(); // รีเฟชข้อมูลหลังจากแก้ไข
              }}
              refetch={refetch} // ส่ง refetch ไปยัง PostPopup
              showSuccessToast={showSuccessToast} // ส่งฟังก์ชันแสดงแจ้งเตือน
            />
          )}
          {reportPost && (
            <Report
              report_type={"post"}
              id={postId}
              onClose={() => setReportPost(false)}
              showReportToast={showReportToast}
            />
          )}
          {showDeletePopup && (
            <DeleteConfirmationPopup
              message="คุณต้องการลบโพสต์นี้หรือไม่?"
              onConfirm={() => {
                setShowDeletePopup(false), showDeleteSuccessToast();
              }}
              onCancel={handleCancelDelete}
              type={deleteType}
              id={selectedPostId}
              refetch={refetch}
            />
          )}
          {showLogin && <PopupLogin onClose={() => setShowLogin(false)} />}
          <div className={styles.headerContainer}>
            <div className="search-subject">
              <input
                type="text"
                placeholder="ค้นหาด้วยชื่อผู้เขียน, หรือเนื้อหา"
                className="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <i className="bx bx-search"></i>
            </div>
            <div
              className={styles.headerButton}
              onClick={() => handlePostPopup(null)}
            >
              <i className="bx bx-pencil"></i>
              <p>เขียนโพสต์</p>
            </div>
          </div>
          <div className="sort-container">
            <select
              id="sort"
              className="sort-group"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {isLoading ? (
            <div className={styles.errorContainer}>
              <div className="text">กำลังโหลด.....</div>
            </div>
          ) : data.pages.flatMap((page) => page.results).length === 0 ? (
            <div className={styles.errorContainer}>
              <div className="text">ไม่มีโพสต์ในขณะนี้</div>
            </div>
          ) : (
            <InfiniteScroll hasMore={hasNextPage} loadMore={fetchNextPage}>
              {data.pages.map((page) =>
                page.results.map((post) => (
                  <div key={post.post_id} className={styles.postContainer}>
                    <div className={styles.postheader}>
                      <div className={styles.profileContainer}>
                        <img
                          className={styles.profileImage}
                          src={post.user_profile}
                          alt="Profile"
                        />
                        <div className={styles.profileInfo}>
                          <h4>{post.username}</h4>
                          <p
                            className="dateTime"
                            title={formatFullDate(post.created_at)}
                          >
                            {post.updated_at
                              ? `แก้ไข ${formatTimeAgo(post.created_at)}`
                              : formatTimeAgo(post.created_at)}
                          </p>
                        </div>
                      </div>

                      <i
                        className={`bx bx-dots-horizontal-rounded ${styles.hoverEffect}`}
                        onClick={() => togglePopup(post.post_id)}
                      ></i>

                      {activePopupId === post.post_id && (
                        <div className="popup-menu" ref={popupRef}>
                          <ul>
                            <>
                              {user && user.user_id === post.user_id && (
                                <>
                                  <li
                                    className="popup-item"
                                    onClick={() =>
                                      handleDeleteClick(post.post_id, "post")
                                    }
                                  >
                                    <i className="bx bx-trash"></i>
                                    ลบ
                                  </li>
                                  <li
                                    className="popup-item"
                                    onClick={() =>
                                      handlePostPopup(post.post_id)
                                    }
                                  >
                                    <i className="bx bx-edit-alt"></i>
                                    แก้ไข
                                  </li>
                                </>
                              )}
                            </>
                            <li
                              className="popup-item"
                              onClick={() => handleReport(post.post_id)}
                            >
                              <i className="bx bx-flag"></i>รายงาน
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                    <p className="content-desc">{post.post_desc}</p>
                    <div className={styles.postFooter}>
                      <div className={styles.reviewBtn}>
                        <div className={styles.likeBtn}>
                          <i
                            className={`bx ${
                              post.user_has_liked === 1 ? "bxs-like" : "bx-like"
                            }`}
                            onClick={() => postReaction(post.post_id, "like")}
                          ></i>
                          <p>{post.like_count}</p>
                        </div>
                        <div className={styles.disLikeBtn}>
                          <i
                            className={`bx ${
                              post.user_has_disliked === 1
                                ? "bxs-dislike"
                                : "bx-dislike"
                            }`}
                            onClick={() =>
                              postReaction(post.post_id, "dislike")
                            }
                          ></i>
                          <p>{post.dislike_count}</p>
                        </div>
                      </div>
                      <div
                        className={styles.postComment}
                        onClick={() => goToPost(post.post_id)}
                      >
                        <i className="bx bx-message-rounded-dots bx-flip-horizontal"></i>
                        <p>{post.comment_count}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </InfiniteScroll>
          )}
        </div>
      </div>
    </>
  );
}

export default Community;
