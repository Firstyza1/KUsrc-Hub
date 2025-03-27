import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./subjects.css";
import Navbar from "../Navbar/Navbar";
import { useInfiniteQuery } from "react-query";
import InfiniteScroll from "react-infinite-scroller";
import { useNavigate } from "react-router-dom";
function Subjects() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState(true);
  const category = [
    { id: 1, name: "กลุ่มสาระอยู่ดีมีสุข" },
    { id: 3, name: "กลุ่มสาระสุนทรียศาสตร์" },
    { id: 4, name: "กลุ่มสาระภาษากับการสื่อสาร" },
    { id: 2, name: "กลุ่มสาระศาสตร์แห่งผู้ประกอบการ" },
    { id: 5, name: "กลุ่มสาระพลเมืองไทยและพลเมืองโลก" },
  ];
  const creditValue = [1, 2, 3];
  const [credit, setCredit] = useState([]);
  const [categoryId, setCategoryId] = useState([]);
  const [search, setSearch] = useState("");

  const handleCategoryChange = (id) => {
    setCategoryId((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    // console.log(categoryId);
  };

  const handleCreditChange = (value) => {
    setCredit((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
    // console.log(credit);
  };

  const fetchSubject = async ({ pageParam = 1 }) => {
    try {
      const params = {
        page: pageParam,
        limit: 5,
      };

      if (credit) {
        params.credit = credit.join(",");
      }
      if (categoryId) {
        params.category_id = categoryId.join(",");
      }
      if (search) {
        params.search = search;
      }
      const response = await axios.get("http://localhost:3000/getSubjectMain", {
        params,
      });
      return {
        results: response.data,
        nextPage: pageParam + 1,
        hasMore: response.data.length > 0,
      };
    } catch (error) {
      console.error("Error fetching subjects:", error);
      return { results: [], nextPage: pageParam, hasMore: false };
    }
  };

  const { data, isLoading, isError, hasNextPage, fetchNextPage, refetch } =
    useInfiniteQuery(["subject", categoryId, credit, search], fetchSubject, {
      getNextPageParam: (lastPage) => {
        return lastPage.hasMore ? lastPage.nextPage : undefined;
      },
    });

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
    return `${day} ${month} ${year}`;
  };

  const getCategoryColor = (categoryId) => {
    // Map categoryId to colors matching your course cards
    switch (categoryId) {
      case 1:
        // return "rgba(204, 240, 72, 0.445)";
        // return " #27ae60";
        return " #90da9f";
      case 2:
        // return "rgba(72, 170, 240, 0.445)";
        // return " #f39c12";
        return " #ffbf80";
      case 3:
        // return "rgba(72, 240, 201, 0.445)";
        // return " #9b59b6";
        return " #7c9bff";
      case 4:
        // return "rgba(72, 240, 89, 0.445)";
        // return " #3498db";
        return " #80d4ff";
      case 5:
        // return "rgba(63, 133, 239, 0.45)";
        // return " #e74c3c";
        return " #ff8080";
      default:
        return "#95a5a6";
    }
  };

  const isNew = (created_at) => {
    const postDate = new Date(created_at); // แปลงสตริงเป็น Date
    const currentDate = new Date(); // วันที่ปัจจุบัน
    const timeDifference = currentDate - postDate; // ความแตกต่างในมิลลิวินาที
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24); // แปลงเป็นวัน
    return daysDifference <= 15; // ตรวจสอบว่าไม่เกิน 15 วัน
  };
  return (
    <>
      <Navbar />
      <div className="subject-page">
        <div className="subject-container">
          <div className="search-subject-container">
            <div className="search-subject">
              <input
                type="text"
                placeholder="ค้นหาด้วยรหัสวิชา / ชื่อวิชา"
                className="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <i className="bx bx-search"></i>
            </div>
            <div className="header-button" onClick={() => setFilter(!filter)}>
              <i className="bx bx-filter-alt"></i>
            </div>
          </div>
          <div className="subject-content">
            <div className="subject-info-container">
              {isLoading ? (
                <div className="no-review">กำลังโหลด.....</div>
              ) : data.pages.flatMap((page) => page.results).length === 0 ? (
                <div className="no-review">ไม่มีรายวิชาในขณะนี้</div>
              ) : (
                <InfiniteScroll hasMore={hasNextPage} loadMore={fetchNextPage}>
                  {data.pages.map((page) =>
                    page.results.map((subject) => (
                      <div
                        className="subject-card"
                        key={subject.subject_id}
                        onClick={() =>
                          navigate(`/Subjects/${subject.subject_id}`)
                        }
                      >
                        <div
                          className="category-indicator"
                          style={{
                            backgroundColor: getCategoryColor(
                              subject.category_id
                            ),
                          }}
                        ></div>
                        <div className="subject-header">
                          <div className="subject-id-section">
                            <div
                              className="subject-id"
                              style={{
                                backgroundColor: getCategoryColor(
                                  subject.category_id
                                ),
                              }}
                            >
                              {subject.subject_id}
                            </div>
                            <div className="subject-titles">
                              <div className="subject-title-th">
                                {subject.subject_thai}
                              </div>
                              <div className="subject-title-en">
                                {subject.subject_eng}
                              </div>
                            </div>

                            {isNew(subject.created_at) ? (
                              <div className="new-ribbon">ใหม่</div>
                            ) : (
                              ""
                            )}
                          </div>

                          <span
                            className="detail-value"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {`[ ${subject.credit} หน่วยกิต ]`}
                          </span>
                        </div>
                        <div className="subject-body">
                          {/* <div className="detail-group">
                            <div className="detail-label">หน่วยกิต</div>
                            <div className="detail-value">{subject.credit}</div>
                          </div> */}
                          <div className="detail-group">
                            {/* <div className="detail-label">หมวดหมู่</div> */}
                            <div className="detail-value">
                              {subject.category_thai}
                            </div>
                          </div>
                          <div className="date-created">
                            {`เมื่อ: ${formatFullDate(subject.created_at)}`}
                          </div>
                        </div>
                        {/* <div className="date-created">
                          {`วันที่สร้าง ${formatFullDate(subject.created_at)}`}
                        </div> */}
                      </div>
                    ))
                  )}
                </InfiniteScroll>
              )}
            </div>
            <div
              className={filter ? `subject-filter active` : `subject-filter`}
            >
              <div className="category-filter">
                <h4>หมวดหมู่วิชา</h4>
                <div className="category-group">
                  {category.map((label, index) => (
                    <label
                      key={index}
                      style={{
                        borderLeft: `7px solid ${getCategoryColor(label.id)}`,
                      }}
                    >
                      <input
                        type="checkbox"
                        name="category"
                        value={label.id}
                        onChange={() => handleCategoryChange(label.id)}
                      />
                      <p>{label.name}</p>
                    </label>
                  ))}
                </div>
              </div>
              <div className="subject-grade-filter">
                <h4>หน่วยกิต</h4>
                <div
                  className="subject-grade-group"
                  // style={{ display: "flex", flexDirection: "column" }}
                >
                  {creditValue.map((label, index) => (
                    <label
                      key={index}
                      // style={{ width:"110px" }}
                    >
                      <input
                        type="checkbox"
                        name="credit"
                        value={label}
                        onChange={() => handleCreditChange(label)}
                      />
                      <p>{label} หน่วยกิต</p>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Subjects;
