import React from "react"
import "./dashboard.css"

export default function StatCard({ title, value, change, icon }) {
  const isPositive = change >= 0

  return (
    <div className="stat-card">
      <div className="stat-header">
        <div>
          <p className="stat-title">{title}</p>
          <p className="stat-value">{value}</p>
		  { value > 0 && 
          <div className={`stat-change ${isPositive ? "positive" : "negative"}`}>
            <span className="stat-arrow">{isPositive ? "↑" : "↓"}</span>
            <span>เพิ่มขึ้น {Math.abs(change)} จากเดือนที่แล้ว</span>
          </div>
}
        </div>
        <div className="stat-icon">{icon}</div>
      </div>
    </div>
  )
}
