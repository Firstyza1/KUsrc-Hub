import React from "react"
import "./dashboard.css"

export default function ComplaintRow({ type, count, change, icon }) {
  return (
    <div className="complaint-row">
      <div className="complaint-info">
        <div className="complaint-icon">{icon}</div>
        <span className="complaint-type">{type}</span>
      </div>
      <div className="complaint-stats">
        <span className="complaint-count">{count}</span>
        <span className="complaint-change">+{change}</span>
      </div>
    </div>
  )
}
