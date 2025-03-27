import React from "react";
import Navbar from "../Navbar/Navbar";
import { useParams } from "react-router-dom";
import Review from "./Review";
import SubjectCard from "./SubjectCard";
import "./SubjectCard.css";
function SubjectDetails() {
  const { subject_id } = useParams();
  return (
    <>
      <Navbar />
      <div className="subject-details-page">
        <Review subject_id={subject_id} />
      </div>
    </>
  );
}

export default SubjectDetails;
