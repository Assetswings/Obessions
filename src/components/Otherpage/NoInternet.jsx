import React from "react";
import "./NoInternet.css";
import mark1 from "../../assets/images/mark1.png";
import mark2 from "../../assets/images/mark2.png";
import mark3 from "../../assets/images/mark3.png";
const NoInternet = ({ onRetry }) => {
  return (
    <div className="no-internet-wrapper">
      {/* floating objects */}
      <img src={mark1} className="float-item soap" alt="soap" />
      <img src={mark2} className="float-item spray" alt="spray" />
      <img src={mark3}  className="float-item brushes" alt="brushes" />

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
