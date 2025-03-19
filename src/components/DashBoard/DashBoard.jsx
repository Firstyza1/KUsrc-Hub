import React from "react"
import { AlertTriangle, BookOpen, Flag, MessageSquare, Star, Users } from "lucide-react"
import StatCard from "./StatCard"
import ComplaintRow from "./ComplaintRow"
import SideBar from "../SideBar/SideBar"
import "./Dashboard.css"

export default function Dashboard() {
  return (
	<>
	<SideBar />
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard title="Total Users" value="24,589" change={12.5} icon={<Users className="icon-size" />} />
        <StatCard title="Total Courses" value="1,234" change={9.5} icon={<BookOpen className="icon-size" />} />
        <StatCard title="Total Reviews" value="45,678" change={15.3} icon={<Star className="icon-size" />} />
        <StatCard title="Alerts" value="3,456" change={-4.2} icon={<AlertTriangle className="icon-size" />} />
      </div>

      {/* Complaints Overview */}
      <div className="complaints-container">
        <h2 className="complaints-title">Complaints Overview</h2>
        <div className="complaints-list">
          <ComplaintRow type="Review Complaints" count={23} change={5} icon={<AlertTriangle className="icon-small" />} />
          <ComplaintRow type="Post Complaints" count={19} change={2} icon={<Flag className="icon-small" />} />
          <ComplaintRow type="Comment Complaints" count={8} change={1} icon={<MessageSquare className="icon-small" />} />
        </div>
      </div>

      {/* Action Button */}
      <div className="button-container">
        <button className="dashboard-button">View Detailed Reports</button>
      </div>
    </div>
	</>
  )
}
