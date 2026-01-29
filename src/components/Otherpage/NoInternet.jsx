import React from "react";
import "./NoInternet.css";

const NoInternet = ({ onRetry }) => {
  return (
    <div className="no-internet-wrapper">
      <img src="/offline/mark1.png" className="float-item soap" alt="soap" />
      <img src="/offline/mark2.png" className="float-item spray" alt="spray" />
      <img src="/offline/mark3.png" className="float-item brushes" alt="brushes" />

      <div className="no-internet-content">
        <h1>No Internet</h1>
        <p>Check your connection and try again.</p>

        {onRetry && (
          <button className="retry-btn" onClick={onRetry}>
            TRY AGAIN
          </button>
        )}
      </div>
    </div>
  );
};

export default NoInternet;
