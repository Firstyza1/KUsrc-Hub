import React, { useEffect, useState, useRef } from "react";
import Navbar from "../Navbar/Navbar";
import { useParams } from "react-router-dom";
import styleCom from "./Community.module.css";
import styles from "./Post.module.css";
import axios from "axios";
import Comment from "./Comment";
import { useUser } from "../User";
import Report from "../Popup/Report";
import DeleteConfirmationPopup from "../Popup/DeleteConfirmationPopup";
import PostPopup from "./PostPopup";

const Post = () => {
  const { post_id } = useParams();
  const [post, setPost] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const [activePopupId, setActivePopupId] = useState(null);
  const [reportPost, setReportPost] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [deleteType, setDeleteType] = useState(null); // "post" หรือ "comment"

  const togglePopup = (postId) => {
    setActivePopupId(activePopupId === postId ? null : postId);
  };

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

  const fetchPost = async () => {
    const params = {};
    if (user && user.user_id) {
      params.user_id = user.user_id;
    }
    try {
      const response = await axios.get(
        `http://localhost:3000/getPostByPostId/${post_id}`,
        { params }
      );
      setPost(response.data);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError("ไม่พบข้อมูลโพสต์");
        } else {
          setError(`เกิดข้อผิดพลาด: ${error.response.status}`);
        }
      } else {
        setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
      }
      console.log("เกิดข้อผิดพลาด:", error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [post_id, user]);

  const handleReport = (post_id) => {
    setSelectedPostId(post_id);
    setReportPost(true);
  };

  const handleDeleteClick = (id, type) => {
    setSelectedPostId(id);
    setDeleteType(type);
    setShowDeletePopup(true);
  };

  const handleCancelDelete = () => {
    setShowDeletePopup(false);
  };

  const handleEditClick = (post_id) => {
    setSelectedPostId(post_id);
    setShowEditPopup(true);
  };

  const handleEditPopupClose = () => {
    setShowEditPopup(false);
    fetchPost();
  };

  const postReaction = async (post_id, type) => {
    try {
      await axios.post("http://localhost:3000/postReaction", {
        post_id: post_id,
        user_id: user.user_id,
        type: type,
      });
      fetchPost();
    } catch (error) {
      console.error("เกิดข้อผิดพลาด :", error);
    }
  };

  if (error) {
    return (
      <>
        <Navbar />
        <div className="error-container">
          <div className="text">{error}</div>
        </div>
      </>
    );
  }

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
  return (
    <>
      <Navbar />
      <div className={styleCom.communityPage}>
        <div className={styleCom.communityContainer}>
          {reportPost && (
            <Report
              report_type="post"
              id={selectedPostId}
              onClose={() => setReportPost(false)}
            />
          )}
          {showDeletePopup && (
            <DeleteConfirmationPopup
              message="คุณต้องการลบข้อมูลนี้หรือไม่?"
              onConfirm={() => setShowDeletePopup(false)}
              onCancel={handleCancelDelete}
              type={deleteType}
              id={selectedPostId}
            />
          )}
          {showEditPopup && (
            <PostPopup
              post_id={selectedPostId}
              onClose={handleEditPopupClose}
            />
          )}
          <div className={styleCom.headerContainer}>
            <div className="header-button">
              <i className="bx bx-caret-left"></i>
              <p>กลับ</p>
            </div>
          </div>
          <>
            <div className={styleCom.postContainer}>
              <div className={styleCom.postheader}>
                <div className={styleCom.profileContainer}>
                  <img
                    className={styleCom.profileImage}
                    src={post.user_profile}
                    alt="Profile"
                  />
                  <div className={styleCom.profileInfo}>
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
                  className={`bx bx-dots-horizontal-rounded ${styleCom.hoverEffect}`}
                  onClick={() => togglePopup(post.post_id)}
                ></i>

                {activePopupId === post.post_id && (
                  <div className="popup-menu" ref={popupRef}>
                    <ul>
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
                            onClick={() => handleEditClick(post.post_id)}
                          >
                            <i className="bx bx-edit-alt"></i>
                            แก้ไข
                          </li>
                        </>
                      )}
                      <li
                        className="popup-item"
                        onClick={() => handleReport(post.post_id)}
                      >
                        <i className="bx bx-flag"></i>
                        รายงาน
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <div className={styleCom.postDesc}>{post.post_desc}</div>
              <div className={styleCom.postFooter}>
                <div className={styleCom.reviewBtn}>
                  <div className={styleCom.likeBtn}>
                    <i
                      className={`bx ${
                        post.user_has_liked === 1 ? "bxs-like" : "bx-like"
                      }`}
                      onClick={() => postReaction(post.post_id, "like")}
                    ></i>
                    <p>{post.like_count}</p>
                  </div>
                  <div className={styleCom.disLikeBtn}>
                    <i
                      className={`bx ${
                        post.user_has_disliked === 1
                          ? "bxs-dislike"
                          : "bx-dislike"
                      }`}
                      onClick={() => postReaction(post.post_id, "dislike")}
                    ></i>
                    <p>{post.dislike_count}</p>
                  </div>
                </div>
                <div className={styleCom.postComment}>
                  <i className="bx bx-message-rounded-dots bx-flip-horizontal"></i>
                  <p>{post.comment_count}</p>
                </div>
              </div>
              {post && post.post_id && <Comment post_id={post.post_id} />}
            </div>
          </>
        </div>
      </div>
    </>
  );
};

export default Post;
