import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./subjects.css";
import Navbar from "../Navbar/Navbar";
function Subjects() {
  const [allSubjects, setAllSubjects] = useState([]); // เก็บข้อมูลต้นฉบับ
  const [subjects, setSubjects] = useState([]); // เก็บข้อมูลที่จะแสดง
  const [selectedCategories, setSelectedCategories] = useState([]); // หมวดหมู่ที่เลือก
  const [selectedCredits, setSelectedCredits] = useState([]); // หน่วยกิตที่เลือก
  const [searchTerm, setSearchTerm] = useState(""); // ค่าที่กรอกในช่องค้นหา
  const clearSearch = () => {
    setSearchTerm("");
  };
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleCreditChange = (credit) => {
    setSelectedCredits((prev) => (prev[0] === credit ? [] : [credit]));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const getCategoryClass = (categoryName) => {
    switch (categoryName) {
      case "กลุ่มสาระอยู่ดีมีสุข":
        return "health";
      case "กลุ่มสาระศาสตร์แห่งผู้ประกอบการ":
        return "entrepreneur";
      case "กลุ่มสาระสุนทรียศาสตร์":
        return "aesthetics";
      case "กลุ่มสาระภาษากับการสื่อสาร":
        return "language";
      default:
        return "citizen";
    }
  };

  const fetchAPI = async () => {
    try {
      const response = await axios.get("http://localhost:3000/Subjects");
      setAllSubjects(response.data.subjects || []);
      setSubjects(response.data.subjects || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      // alert("ไม่สามารถดึงข้อมูลได้");
    }
  };

  useEffect(() => {
    let filteredSubjects = allSubjects;

    // กรองตามหมวดหมู่
    if (selectedCategories.length > 0) {
      filteredSubjects = filteredSubjects.filter((subject) =>
        selectedCategories.includes(subject.category_thai)
      );
    }

    // กรองตามหน่วยกิต
    if (selectedCredits.length > 0) {
      filteredSubjects = filteredSubjects.filter((subject) =>
        selectedCredits.includes(subject.credit)
      );
    }

    // ค้นหาด้วยรหัสวิชา, ชื่อไทย หรือชื่ออังกฤษ
    if (searchTerm.trim() !== "") {
      filteredSubjects = filteredSubjects.filter(
        (subject) =>
          subject.subject_id.includes(searchTerm) ||
          subject.subject_thai.includes(searchTerm) ||
          subject.subject_eng.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setSubjects(filteredSubjects);
  }, [selectedCategories, selectedCredits, searchTerm, allSubjects]);

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <>
      <Navbar />
      <div className="subject">
        <div className="subject-container1">
          <h1>รีวิวรายวิชา</h1>
          {/* <Link className="requset-button" to="/Requestform">
            <i className="bx bx-send"></i> คำร้องขอเพิ่มรายวิชา
          </Link> */}
        </div>
        <div className="subject-container2">
          <div className="search-container">
            {searchTerm ? (
              <i
                className="bx bx-x"
                onClick={clearSearch}
                style={{ cursor: "pointer" }}
              ></i>
            ) : (
              <i className="bx bx-search"></i>
            )}
            <input
              type="text"
              placeholder="ค้นหาด้วยรหัสวิชา ชื่อวิชาภาษาไทย / ภาษาอังกฤษ"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="subject-container3">
          <div className="subject-container">
            {subjects.length > 0 ? (
              subjects.map((subject) => (
                <div className="subject-card" key={subject.subject_id}>
                  <div className={getCategoryClass(subject.category_thai)}>
                    <Link
                      to={`/Subjects/${subject.subject_id}`}
                      className="subject-link"
                    >
                      <p>
                        {subject.subject_id} | {subject.subject_thai} (
                        {subject.subject_eng})
                      </p>
                      <div className="subject-detail">
                        <p>{subject.category_thai}</p>
                        <p>[หน่วยกิต {subject.credit}]</p>
                      </div>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-subject">
                <h1>ไม่มีข้อมูลรายวิชา</h1>
              </div>
            )}
          </div>

          <div className="filter-subject">
            <div className="filter-subject-header">
              <label>หมวดหมู่ศึกษาทั่วไป</label>
            </div>
            <div className="subject-category">
              <label>
                <input
                  type="checkbox"
                  value="กลุ่มสาระอยู่ดีมีสุข"
                  checked={selectedCategories.includes("กลุ่มสาระอยู่ดีมีสุข")}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                />
                <mark id="health">กลุ่มสาระอยู่ดีมีสุข</mark>
              </label>
              <label>
                <input
                  type="checkbox"
                  value="กลุ่มสาระศาสตร์แห่งผู้ประกอบการ"
                  checked={selectedCategories.includes(
                    "กลุ่มสาระศาสตร์แห่งผู้ประกอบการ"
                  )}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                />
                <mark id="entrepreneur">กลุ่มสาระศาสตร์แห่งผู้ประกอบการ</mark>
              </label>
              <label>
                <input
                  type="checkbox"
                  value="กลุ่มสาระสุนทรียศาสตร์"
                  checked={selectedCategories.includes(
                    "กลุ่มสาระสุนทรียศาสตร์"
                  )}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                />
                <mark id="aesthetics">กลุ่มสาระสุนทรียศาสตร์</mark>
              </label>
              <label>
                <input
                  type="checkbox"
                  value="กลุ่มสาระภาษากับการสื่อสาร"
                  checked={selectedCategories.includes(
                    "กลุ่มสาระภาษากับการสื่อสาร"
                  )}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                />
                <mark id="language">กลุ่มสาระภาษากับการสื่อสาร</mark>
              </label>
              <label>
                <input
                  type="checkbox"
                  value="กลุ่มสาระพลเมืองไทยและพลเมืองโลก"
                  checked={selectedCategories.includes(
                    "กลุ่มสาระพลเมืองไทยและพลเมืองโลก"
                  )}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                />
                <mark id="citizen">กลุ่มสาระพลเมืองไทยและพลเมืองโลก</mark>
              </label>
            </div>
            <div className="filter-subject-header">
              <label>จำนวนหน่วยกิต</label>
            </div>
            <div className="select-credit">
              <label>
                <input
                  type="checkbox"
                  value={1}
                  checked={selectedCredits.includes(1)}
                  onChange={(e) => handleCreditChange(Number(e.target.value))}
                />
                <mark id="credit-1">1</mark>
              </label>
              <label>
                <input
                  type="checkbox"
                  value={2}
                  checked={selectedCredits.includes(2)}
                  onChange={(e) => handleCreditChange(Number(e.target.value))}
                />
                <mark id="credit-2">2</mark>
              </label>
              <label>
                <input
                  type="checkbox"
                  value={3}
                  checked={selectedCredits.includes(3)}
                  onChange={(e) => handleCreditChange(Number(e.target.value))}
                />
                <mark id="credit-3">3</mark>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Subjects;
