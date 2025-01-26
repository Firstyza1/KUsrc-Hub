import React from "react";
import Navbar from "../Navbar/Navbar";
import "./About.css";
function About() {
  return (
    <>
      <Navbar />
      <div className="about-us-page">
        <div className="about-us-header">
          <div className="text">
            เกี่ยวกับเรา<div className="underline"></div>
          </div>
        </div>
        <div className="container-content-1">
          <div className="container-text-1">
            <p>
              เว็บไซต์นี้มีเป้าหมายในการช่วยนักศึกษามหาวิทยาลัยเกษตรศาสตร์
              ศรีราชา ในการตัดสินใจเลือกลงทะเบียนวิชาต่าง ๆ
              ได้อย่างมีข้อมูลและมั่นใจยิ่งขึ้น
            </p>
          </div>
        </div>
        {/* <div className="container-content-2">
          <div className="container-text-2">
            <p>
              เราเชื่อว่าการแบ่งปันประสบการณ์จะช่วยสร้างสังคมการเรียนรู้ที่แข็งแรงและช่วยนักศึกษาเติบโตไปพร้อมกัน
            </p>
          </div>
        </div> */}
      </div>
      {/* <div className="about-us-image">
        <img src="src/assets/images/aboutus.jpeg" />
      </div> */}
    </>
  );
}

export default About;
