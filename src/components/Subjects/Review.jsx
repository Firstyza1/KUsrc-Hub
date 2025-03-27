import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { useUser } from "../UserContext/User";
import "./Review.css";
import { useInfiniteQuery } from "react-query";
import InfiniteScroll from "react-infinite-scroller";
const MemoizedReview = React.memo(Review);
import Report from "../Popup/Report";
import ReviewPopup from "./ReviewPopup";
import DeleteConfirmationPopup from "../Popup/DeleteConfirmationPopup";
import { toast } from "react-toastify";
import SubjectCard from "./SubjectCard";
import { useNavigate } from "react-router-dom";
import PopupLogin from "../Popup/PopupLogin";
function Review({ subject_id }) {
  const [showPopupReview, setShowPopupReview] = useState(false);
  const [reportReview, setReportReview] = useState(false);
  const [activePopupId, setActivePopupId] = useState(null);
  const { user } = useUser();
  const [content, setContent] = useState("review");
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const togglePopup = (reviewId) => {
    setActivePopupId(activePopupId === reviewId ? null : reviewId);
  };
  const currentYear = new Date().getFullYear() + 543;
  const years = useMemo(
    () => Array.from({ length: 5 }, (_, i) => currentYear - i),
    [currentYear]
  );
  const Terms = useMemo(() => ["ต้น", "ปลาย", "ฤดูร้อน"], []);

  const [selectedTerms, setSelectedTerms] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const fetchReview = async ({ pageParam = 1 }) => {
    try {
      let url = `http://localhost:3000/getReview/${subject_id}?page=${pageParam}&limit=5`;

      if (selectedTerms) url += `&semester=${selectedTerms}`;
      if (selectedYear) url += `&academic_year=${selectedYear}`;
      if (content === "pdf") url += `&includePdf=true`;
      if (user && user.user_id) url += `&user_id=${user.user_id}`;
      const response = await axios.get(url);
      return {
        results: response.data,
        nextPage: pageParam + 1,
        hasMore: response.data.length > 0,
      };
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
      return { results: [], nextPage: pageParam, hasMore: false };
    }
  };

  const { data, isLoading, isError, hasNextPage, fetchNextPage, refetch } =
    useInfiniteQuery(
      ["review", selectedYear, selectedTerms, content, user?.user_id],
      fetchReview,
      {
        getNextPageParam: (lastPage) => {
          return lastPage.hasMore ? lastPage.nextPage : undefined;
        },
        // getNextPageParam: (lastPage, pages) => {
        //   if (lastPage.nextPage < lastPage.totalPages) return lastPage.nextPage;
        //   return undefined;
        // },
      }
    );

  const reviewReaction = async (review_id, type) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    try {
      await axios.post(
        "http://localhost:3000/reviewReactions",
        {
          review_id: review_id,
          user_id: user?.user_id,
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
      toast.error("เกิดข้อผิดพลาด", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // console.error("เกิดข้อผิดพลาด :", error);
    }
  };

  const getIconForScore = (value) => {
    if (value >= 0 && value <= 20) {
      return <i className="bx bx-dizzy"></i>;
    } else if (value > 20 && value <= 40) {
      return <i className="bx bx-tired"></i>;
    } else if (value > 40 && value <= 60) {
      return <i className="bx bx-meh-alt"></i>;
    } else if (value > 60 && value <= 80) {
      return <i className="bx bx-smile"></i>;
    } else if (value > 80 && value <= 100) {
      return <i className="bx bx-happy-beaming"></i>;
    } else {
      return null;
    }
  };

  const [reviewId, setReviewId] = useState(null);
  const handleReviewPopup = (review_id) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    setReviewId(review_id);
    setShowPopupReview(true);
  };
  const handleReport = (review_id) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    setReviewId(review_id);
    setReportReview(true);
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

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [deleteType, setDeleteType] = useState(null);
  const handleDeleteClick = (review_id) => {
    setSelectedReviewId(review_id);
    setDeleteType("review");
    setShowDeletePopup(true);
  };

  const handleCancelDelete = () => {
    setShowDeletePopup(false);
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

  const showDeleteSuccessToast = () => {
    toast.success("ลบรีวิวสำเร็จ", {
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
    toast.success("เขียนรีวิวสำเร็จ", {
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
    toast.success("ส่งรายงานรีวิวสำเร็จ", {
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
      {showDeletePopup && (
        <DeleteConfirmationPopup
          message="คุณต้องการลบรีวิวนี้หรือไม่?"
          onConfirm={() => {
            setShowDeletePopup(false), showDeleteSuccessToast();
          }}
          onCancel={handleCancelDelete}
          type={deleteType}
          id={selectedReviewId}
          refetch={refetch}
        />
      )}
      {showLogin && <PopupLogin onClose={() => setShowLogin(false)} />}
      <div className="subject-details-container">
        <div className="review-container">
          <div className="header-button-container">
            <div className="header-button" onClick={() => navigate(-1)}>
              <i className="bx bx-caret-left"></i>
              <span>กลับ</span>
            </div>
            <div
              className="header-button"
              onClick={() => {
                handleReviewPopup(null);
                // setReviewId(null), setShowPopupReview(true);
              }}
            >
              <i className="bx bx-pencil"></i>
              <span>เขียนรีวิว</span>
            </div>
          </div>
          <SubjectCard subject_id={subject_id} />
          <div className="review-menu">
            <div className="review-btn-containter">
              <p
                className={
                  content === "review" ? "review-btn active" : "review-btn"
                }
                onClick={() => setContent("review")}
              >
                รีวิว
              </p>
              <p
                className={
                  content === "pdf" ? "review-btn active" : "review-btn"
                }
                onClick={() => setContent("pdf")}
              >
                เอกสารสรุป
              </p>
            </div>

            <div className="filter-review-container">
              <div className="academic-year-filter">
                <p>ปีการศึกษา</p>
                <select
                  id="yearSelect"
                  className="year-select"
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="">--ทั้งหมด--</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="term-year-filter">
                <p>ภาคเรียน</p>
                <select
                  id="yearSelect"
                  className="year-select"
                  onChange={(e) => setSelectedTerms(e.target.value)}
                >
                  <option value="">--ทั้งหมด--</option>
                  {Terms.map((Term) => (
                    <option key={Term} value={Term}>
                      {Term}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="review-comment-container">
            <>
              {isLoading ? (
                <p className="no-review">กำลังโหลด.....</p>
              ) : data.pages.flatMap((page) => page.results).length === 0 ? (
                <p className="no-review">รายวิชานี้ยังไม่มีรีวิว</p>
              ) : (
                <InfiniteScroll hasMore={hasNextPage} loadMore={fetchNextPage}>
                  {data.pages.map((page) =>
                    page.results.map((review) => {
                      return (
                        <div key={review.review_id} className="review-comment">
                          <div className="review-comment-header">
                            <div className="profile-comment">
                              <img
                                className="profile-image"
                                src={review.user_profile}
                                alt="Profile"
                              />
                              <div className="profile-info-container">
                                <div className="profile-info">
                                  <h4 className="profile-name">
                                    {review.username}
                                  </h4>
                                  <p>|</p>
                                  <p>{review.semester}</p>
                                  <p>{review.academic_year}</p>
                                  <p>
                                    {review.grade ? (
                                      <span className="grade">
                                        {review.grade}
                                      </span>
                                    ) : (
                                      <></>
                                    )}
                                  </p>
                                </div>
                                <div className="term">
                                  <p
                                    className="dateTime"
                                    title={formatFullDate(review.created_at)}
                                  >
                                    {review.updated_at
                                      ? `แก้ไข ${formatTimeAgo(
                                          review.created_at
                                        )}`
                                      : formatTimeAgo(review.created_at)}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <i
                              className="bx bx-dots-horizontal-rounded hover-effect"
                              onClick={() => togglePopup(review.review_id)}
                            ></i>
                            {activePopupId === review.review_id && (
                              <div className="popup-menu" ref={popupRef}>
                                <ul>
                                  <>
                                    {user &&
                                      user.user_id === review.user_id && (
                                        <>
                                          <li
                                            className="popup-item"
                                            onClick={() =>
                                              handleDeleteClick(
                                                review.review_id
                                              )
                                            }
                                          >
                                            <i className="bx bx-trash"></i>
                                            ลบ
                                          </li>
                                          <li
                                            className="popup-item"
                                            onClick={() =>
                                              handleReviewPopup(
                                                review.review_id
                                              )
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
                                    onClick={() =>
                                      handleReport(review.review_id)
                                    }
                                  >
                                    <i className="bx bx-flag"></i>รายงาน
                                  </li>
                                </ul>
                              </div>
                            )}
                          </div>
                          <div className="content-desc">
                            {review.review_desc}
                          </div>
                          <div className="review-footer">
                            <div className="review-btn-container">
                              <div className="like-btn">
                                <i
                                  className={`bx ${
                                    review.user_has_liked === 1
                                      ? "bxs-like"
                                      : "bx-like"
                                  }`}
                                  onClick={() =>
                                    reviewReaction(review.review_id, "like")
                                  }
                                ></i>
                                <p>{review.like_count}</p>
                              </div>
                              <div className="dis-like-btn">
                                <i
                                  className={`bx ${
                                    review.user_has_disliked === 1
                                      ? "bxs-dislike"
                                      : "bx-dislike"
                                  }`}
                                  onClick={() =>
                                    reviewReaction(review.review_id, "dislike")
                                  }
                                ></i>
                                <p>{review.dislike_count}</p>
                              </div>
                            </div>
                            <div className="overall-score">
                              <i>
                                {getIconForScore(review.overall_percentage)}
                              </i>
                              <p>พึงพอใจ</p>
                              <p>{review.overall_percentage}%</p>
                            </div>
                            {review.pdf_path && (
                              <div className="pdf-path">
                                <div
                                  onClick={() =>
                                    window.open(review.pdf_path, "_blank")
                                  }
                                  className="pdf-link"
                                  style={{ cursor: "pointer" }} // เพิ่มสไตล์ให้ดูคลิกได้
                                >
                                  <i className="bx bx-file"></i>
                                  <p>เอกสารสรุป</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </InfiniteScroll>
              )}
            </>
          </div>
          {reportReview && (
            <Report
              report_type={"review"}
              id={reviewId}
              onClose={() => setReportReview(false)}
              showReportToast={showReportToast}
            />
          )}
          {showPopupReview && (
            <ReviewPopup
              subject_id={subject_id}
              review_id={reviewId}
              onClose={() => setShowPopupReview(false)}
              showSuccessToast={showSuccessToast}
              refetch={refetch}
            />
          )}
        </div>
      </div>
    </>
  );
}
export default Review;
