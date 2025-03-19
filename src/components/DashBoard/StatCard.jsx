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
          <div className={`stat-change ${isPositive ? "positive" : "negative"}`}>
            <span className="stat-arrow">{isPositive ? "↑" : "↓"}</span>
            <span>{Math.abs(change)}% from last month</span>
          </div>
        </div>
        <div className="stat-icon">{icon}</div>
      </div>
    </div>
  )
}
