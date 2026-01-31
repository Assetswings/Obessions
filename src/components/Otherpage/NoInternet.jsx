import React from "react";
import "./NoInternet.css";
import { offlineImages } from "../../assets/offlineImages";

const NoInternet = ({ onRetry }) => {
  return (
    <div className="no-internet-wrapper">
      <img src={offlineImages.mark1} className="float-item soap" alt="soap" />
      <img src={offlineImages.mark2} className="float-item spray" alt="spray" />
      <img src={offlineImages.mark3} className="float-item brushes" alt="brushes" />

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
