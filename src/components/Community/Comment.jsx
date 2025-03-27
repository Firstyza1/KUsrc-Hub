import React, { useEffect, useState, useRef } from "react";
import styles from "./Comment.module.css";
import stylesPost from "./Community.module.css";
import axios from "axios";
import { useUser } from "../UserContext/User";
import { CommentFormSchema } from "../YupValidation/Validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useInfiniteQuery } from "react-query";
import InfiniteScroll from "react-infinite-scroller";
import Report from "../Popup/Report";
import DeleteConfirmationPopup from "../Popup/DeleteConfirmationPopup";
import { toast } from "react-toastify";

const Comment = ({ post_id }) => {
  const [inputType, setInputType] = useState(true);
  const { user } = useUser();
  const [reportComment, setReportComment] = useState(false);
  const [activePopupId, setActivePopupId] = useState(null);
  const [commentId, setCommentId] = useState(null);
  const [editComment, setEditComment] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [deleteType, setDeleteType] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const [editCharCount, setEditCharCount] = useState(0);
  const maxCharLimit = 300;

  const sortOptions = [
    { value: "desc", label: "ใหม่ล่าสุด" },
    { value: "asc", label: "เก่าที่สุด" },
  ];
  const [sortOrder, setSortOrder] = useState("desc");

  // ใช้ useForm สำหรับการสร้างความคิดเห็นใหม่
  const {
    handleSubmit: handleCreateSubmit,
    register: createRegister,
    formState: { errors: createErrors },
    setValue: setCreateValue,
    watch: watchCreate,
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
    watch: watchEdit,
  } = useForm({
    resolver: yupResolver(CommentFormSchema),
    reValidateMode: "onSubmit",
  });

  // ตรวจสอบความยาวข้อความในโหมดสร้างความคิดเห็น
  const createCommentDesc = watchCreate("comment_desc", "");
  useEffect(() => {
    setCharCount(createCommentDesc?.length || 0);
  }, [createCommentDesc]);

  // ตรวจสอบความยาวข้อความในโหมดแก้ไขความคิดเห็น
  const editCommentDesc = watchEdit("comment_desc", "");
  useEffect(() => {
    setEditCharCount(editCommentDesc?.length || 0);
  }, [editCommentDesc]);

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
        sort: sortOrder,
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
    useInfiniteQuery(["comment", post_id, sortOrder], fetchComment, {
      getNextPageParam: (lastPage) => {
        return lastPage.hasMore ? lastPage.nextPage : undefined;
      },
    });

  const showDeleteSuccessToast = () => {
    toast.success("ลบความคิดเห็นสำเร็จ", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const showSuccessToast = () => {
    toast.success("เขียนความคิดเห็นสำเร็จ", {
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
    toast.success("รายงานความคิดเห็นสำเร็จ", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const createComment = async (data) => {
    try {
      await axios.post(
        "http://localhost:3000/createComment",
        {
          user_id: user.user_id,
          post_id: post_id,
          comment_desc: data.comment_desc,
        },
        {
          headers: {
            authtoken: `Bearer ${user?.token}`,
          },
        }
      );

      setCreateValue("comment_desc", "");
      setInputType(true);
      refetch();
      showSuccessToast();
    } catch (error) {
      console.error("เกิดข้อผิดพลาด :", error);
    }
  };

  const editCommentSubmit = async (data) => {
    try {
      await axios.post(
        "http://localhost:3000/createComment",
        {
          user_id: user.user_id,
          post_id: post_id,
          comment_desc: data.comment_desc,
          comment_id: commentId,
        },
        {
          headers: {
            authtoken: `Bearer ${user?.token}`,
          },
        }
      );
      setEditValue("comment_desc", "");
      setEditComment(null);
      refetch();
      showSuccessToast();
    } catch (error) {
      console.error("เกิดข้อผิดพลาด :", error);
    }
  };

  const commentReaction = async (comment_id, type) => {
    if (!user || !user.user_id) {
      return;
    }
    try {
      await axios.post(
        "http://localhost:3000/commentReaction",
        {
          comment_id: comment_id,
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
    const date = new Date(dateString);
    const now = new Date();
    const timeDifference = now - date;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
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
    const date = new Date(dateString);
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

    const dayOfWeek = thaiDays[date.getDay()];
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543;
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `วัน${dayOfWeek}ที่ ${day} ${month} ${year} เวลา ${hours}.${minutes} น.`;
  };

  return (
    <>
      {reportComment && (
        <Report
          report_type={"comment"}
          id={commentId}
          onClose={() => setReportComment(false)}
          showReportToast={showReportToast}
        />
      )}
      {showDeletePopup && (
        <DeleteConfirmationPopup
          message="คุณต้องการลบความคิดเห็นนี้หรือไม่?"
          onConfirm={() => {
            setShowDeletePopup(false), showDeleteSuccessToast();
          }}
          onCancel={handleCancelDelete}
          type={deleteType}
          id={selectedCommentId}
          refetch={refetch}
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
              maxLength={maxCharLimit}
              onChange={(e) => {
                if (e.target.value.length > maxCharLimit) {
                  e.target.value = e.target.value.substring(0, maxCharLimit);
                }
                setCharCount(e.target.value.length);
              }}
            />
            <div className={styles.charCounter}>
              {charCount}/{maxCharLimit}
            </div>
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
                        title={formatFullDate(comment.created_at)}
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
                      maxLength={maxCharLimit}
                      onChange={(e) => {
                        if (e.target.value.length > maxCharLimit) {
                          e.target.value = e.target.value.substring(
                            0,
                            maxCharLimit
                          );
                        }
                        setEditCharCount(e.target.value.length);
                      }}
                    />
                    <div className={styles.charCounter}>
                      <p>
                        {editCharCount}/{maxCharLimit}
                      </p>
                    </div>
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
                    <p className="content-desc">{comment.comment_desc}</p>
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
