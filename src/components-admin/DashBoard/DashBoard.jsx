import { useEffect, useState } from "react";
import { AlertTriangle, BookOpen, Flag, MessageSquare, Star, Users, StickyNote } from "lucide-react";
import StatCard from "./StatCard";
import ComplaintRow from "./ComplaintRow";
import SideBar from "../SideBar/SideBar";
import "./Dashboard.css";
import axios from "axios";

export default function Dashboard() {
  const [stat, setStat] = useState(undefined);

  const fetchAPI = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/getAllStats`
      );
      setStat(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  useEffect(() => {
    // console.log(stat);
  }, [stat]);

  return (
    <>
      <SideBar />
      <div className="dashboard-container">
        <h1 className="dashboard-title">ภาพรวมของแดชบอร์ด</h1>

        {/* Stats Cards */}
        <div className="stats-grid">
          <StatCard
            title="ผู้ใช้ทั้งหมด"
            value={stat?.stats?.total_users || "0"}
            change={stat?.growth?.users.current_month}
            icon={<i className="bx bx-user" ></i>}
          />
          <StatCard
            title="วิชาเรียนทั้งหมด"
            value={stat?.stats?.total_subjects || "0"}
            change={stat?.growth?.subjects.current_month}
            icon={<i className="bx bx-book" ></i>}
          />
          <StatCard
            title="การรีวิวทั้งหมด"
            value={stat?.stats?.total_reviews || "0"}
            change={stat?.growth?.reviews.current_month}
            icon={<i className="bx bx-message"></i>}
          />
          <StatCard
            title="โพสต์ทั้งหมด"
            value={stat?.stats?.total_posts || "0"}
            change={stat?.growth.posts?.current_month}
            icon={<i className="bx bx-send"></i> }
          />
        </div>

        {/* Complaints Overview */}
        <div className="complaints-container">
          <h2 className="complaints-title">ภาพรวมการร้องเรียน</h2>
          <div className="complaints-list">
            <ComplaintRow type="รายงานแจ้งลบรีวิว" count={stat?.stats?.total_reported_reviews} icon={<AlertTriangle className="icon-small" />} />
            <ComplaintRow type="รายงานแจ้งลบโพสต์" count={stat?.stats?.total_reported_posts} icon={<Flag className="icon-small" />} />
            <ComplaintRow type="รายงานแจ้งลบความคิดเห็น" count={stat?.stats?.total_reported_comments} icon={<MessageSquare className="icon-small" />} />
          </div>
        </div>
      </div>
    </>
  );
}
