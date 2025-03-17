import React, { useEffect, useState, useRef } from "react";
import styles from "./Comment.module.css";
import stylesPost from "./Community.module.css";
import axios from "axios";
import { useUser } from "../User";
import { CommentFormSchema } from "../YupValidation/Validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useInfiniteQuery } from "react-query";
import InfiniteScroll from "react-infinite-scroller";
import Report from "../Popup/Report";
import DeleteConfirmationPopup from "../Popup/DeleteConfirmationPopup";

const Comment = ({ post_id }) => {
  const [inputType, setInputType] = useState(true);
  const { user } = useUser();
  const [reportComment, setReportComment] = useState(false);
  const [activePopupId, setActivePopupId] = useState(null);
  const [commentId, setCommentId] = useState(null);
  const [editComment, setEditComment] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [deleteType, setDeleteType] = useState(null); // "comment"

  // ใช้ useForm สำหรับการสร้างความคิดเห็นใหม่
  const {
    handleSubmit: handleCreateSubmit,
    register: createRegister,
    formState: { errors: createErrors },
    setValue: setCreateValue,
  } = useForm({
    resolver: yupResolver(CommentFormSchema),
    reValidateMode: "onSubmit",
  });

  // ใช้ useForm สำหรับการแก้ไขความคิดเห็น
  const {
    handleSubmit: handleEditSubmit,
    register: editRegister,
    formState: { errors: editErrors },
    setValue: setEditValue,
  } = useForm({
    resolver: yupResolver(CommentFormSchema),
    reValidateMode: "onSubmit",
  });

  const handleInputChange = () => {
    setInputType(false);
    setCommentId(null);
  };

  const fetchComment = async ({ pageParam = 1 }) => {
    if (!post_id) {
      console.error("post_id is undefined");
      return { results: [], nextPage: pageParam, hasMore: false };
    }

    try {
      const params = {
        page: pageParam,
        limit: 5,
      };
      if (user && user.user_id) {
        params.user_id = user.user_id;
      }
      const response = await axios.get(
        `http://localhost:3000/getCommentByPost/${post_id}`,
        { params }
      );
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
    useInfiniteQuery(["comment", post_id], fetchComment, {
      getNextPageParam: (lastPage) => {
        return lastPage.hasMore ? lastPage.nextPage : undefined;
      },
    });

  const createComment = async (data) => {
    try {
      await axios.post("http://localhost:3000/createComment", {
        user_id: user.user_id,
        post_id: post_id,
        comment_desc: data.comment_desc,
      });

      setCreateValue("comment_desc", "");
      setInputType(true);
      refetch();
    } catch (error) {
      console.error("เกิดข้อผิดพลาด :", error);
    }
  };

  const editCommentSubmit = async (data) => {
    try {
      await axios.post("http://localhost:3000/createComment", {
        user_id: user.user_id,
        post_id: post_id,
        comment_desc: data.comment_desc,
        comment_id: commentId,
      });

      setEditValue("comment_desc", "");
      setEditComment(null);
      refetch();
    } catch (error) {
      console.error("เกิดข้อผิดพลาด :", error);
    }
  };

  const commentReaction = async (comment_id, type) => {
    if (!user || !user.user_id) {
      return;
    }
    try {
      await axios.post("http://localhost:3000/commentReaction", {
        comment_id: comment_id,
        user_id: user.user_id,
        type: type,
      });
      refetch();
    } catch (error) {
      console.error("เกิดข้อผิดพลาด :", error);
    }
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

  const handleReport = (comment_id) => {
    setCommentId(comment_id);
    setReportComment(true);
  };

  const handleDeleteClick = (comment_id) => {
    setSelectedCommentId(comment_id);
    setDeleteType("comment");
    setShowDeletePopup(true);
  };

  const handleCancelDelete = () => {
    setShowDeletePopup(false);
  };

  const togglePopup = (commentId) => {
    setActivePopupId(activePopupId === commentId ? null : commentId);
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

  return (
    <>
      {reportComment && (
        <Report
          report_type={"comment"}
          id={commentId}
          onClose={() => setReportComment(false)}
        />
      )}
      {showDeletePopup && (
        <DeleteConfirmationPopup
          message="คุณต้องการลบความคิดเห็นนี้หรือไม่?"
          onConfirm={() => setShowDeletePopup(false)}
          onCancel={handleCancelDelete}
          type={deleteType}
          id={selectedCommentId}
        />
      )}
      <div className={styles.createCommet}>
        {inputType ? (
          <textarea
            placeholder="เขียนความคิดเห็น..."
            onFocus={handleInputChange}
            style={{ resize: "none", height: "36px", cursor: "pointer" }}
          />
        ) : (
          <>
            <textarea
              placeholder="เขียนความคิดเห็น..."
              {...createRegister("comment_desc")}
            />
            {createErrors.comment_desc && (
              <div className="text-error" style={{ marginLeft: "8px" }}>
                {createErrors.comment_desc.message}
              </div>
            )}

            <div className={styles.commentBtn}>
              <button
                className={styles.cancel}
                onClick={() => setInputType(true)}
              >
                ยกเลิก
              </button>
              <button
                className={styles.submit}
                onClick={handleCreateSubmit(createComment)}
              >
                ยืนยัน
              </button>
            </div>
          </>
        )}
      </div>
      {isLoading ? (
        <div className={stylesPost.errorContainer}>
          <div className="text">กำลังโหลด.....</div>
        </div>
      ) : data.pages.flatMap((page) => page.results).length === 0 ? (
        <div className={stylesPost.errorContainer}>
          <div className="text">ไม่มีความคิดเห็นในขณะนี้</div>
        </div>
      ) : (
        <InfiniteScroll hasMore={hasNextPage} loadMore={fetchNextPage}>
          {data.pages.map((page) =>
            page.results.map((comment) => (
              <div key={comment.comment_id} className={styles.commentContainer}>
                <div className={stylesPost.postheader}>
                  <div className={stylesPost.profileContainer}>
                    <img
                      className={stylesPost.profileImage}
                      src={comment.user_profile}
                      alt="Profile"
                    />
                    <div className={stylesPost.profileInfo}>
                      <h4>{comment.username}</h4>

                      <p
                        className="dateTime"
                        title={formatFullDate(
                          comment.created_at
                        )}
                      >
                        {comment.updated_at
                          ? `แก้ไข ${formatTimeAgo(comment.created_at)}`
                          : formatTimeAgo(comment.created_at)}
                      </p>
                    </div>
                  </div>
                  <i
                    className={`bx bx-dots-horizontal-rounded ${stylesPost.hoverEffect}`}
                    onClick={(e) => togglePopup(comment.comment_id)}
                  ></i>
                  {activePopupId === comment.comment_id && (
                    <div className="popup-menu" ref={popupRef}>
                      <ul>
                        <>
                          {user && user.user_id === comment.user_id && (
                            <>
                              <li
                                className="popup-item"
                                onClick={() =>
                                  handleDeleteClick(comment.comment_id)
                                }
                              >
                                <i className="bx bx-trash"></i>
                                ลบ
                              </li>
                              <li
                                className="popup-item"
                                onClick={() => {
                                  setEditComment(comment.comment_id);
                                  setCommentId(comment.comment_id);
                                  setEditValue(
                                    "comment_desc",
                                    comment.comment_desc
                                  );
                                }}
                              >
                                <i className="bx bx-edit-alt"></i>
                                แก้ไข
                              </li>
                            </>
                          )}
                        </>
                        <li
                          className="popup-item"
                          onClick={() => handleReport(comment.comment_id)}
                        >
                          <i className="bx bx-flag"></i>รายงาน
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                {editComment === comment.comment_id ? (
                  <div className={styles.createCommet}>
                    <textarea
                      placeholder="เขียนความคิดเห็น..."
                      {...editRegister("comment_desc")}
                      defaultValue={comment.comment_desc}
                    />
                    {editErrors.comment_desc && (
                      <div className="text-error" style={{ marginLeft: "8px" }}>
                        {editErrors.comment_desc.message}
                      </div>
                    )}

                    <div className={styles.commentBtn}>
                      <button
                        className={styles.cancel}
                        onClick={() => setEditComment(null)}
                      >
                        ยกเลิก
                      </button>
                      <button
                        className={styles.submit}
                        onClick={handleEditSubmit(editCommentSubmit)}
                      >
                        ยืนยัน
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p>{comment.comment_desc}</p>
                    <div className={stylesPost.postFooter}>
                      <div className={stylesPost.reviewBtn}>
                        <div className={stylesPost.likeBtn}>
                          <i
                            className={`bx ${
                              comment.user_has_liked === 1
                                ? "bxs-like"
                                : "bx-like"
                            }`}
                            onClick={() =>
                              commentReaction(comment.comment_id, "like")
                            }
                          ></i>
                          <p>{comment.like_count}</p>
                        </div>
                        <div className={stylesPost.disLikeBtn}>
                          <i
                            className={`bx ${
                              comment.user_has_disliked === 1
                                ? "bxs-dislike"
                                : "bx-dislike"
                            }`}
                            onClick={() =>
                              commentReaction(comment.comment_id, "dislike")
                            }
                          ></i>
                          <p>{comment.dislike_count}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </InfiniteScroll>
      )}
    </>
  );
};

export default Comment;
