import React from "react"
import "./dashboard.css"

export default function ComplaintRow({ type, count, icon }) {
  return (
    <div className="complaint-row">
      <div className="complaint-info">
        <div className="complaint-icon">{icon}</div>
        <span className="complaint-type">{type}</span>
      </div>
      <div className="complaint-stats">
        <span className="complaint-count">{count}</span>
      </div>
    </div>
  )
}
