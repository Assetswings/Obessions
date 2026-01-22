import React from "react";
import "./NotFound.css";

const NotFound = ({ onGoHome }) => {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <div className="notfound-404">
          <span>4</span>
          <img
            src="/trash-bin.png"
            alt="404 icon"
            className="notfound-icon"
          />
          <span>4</span>
        </div>

        <h2>Page Not Found</h2>
        <p>
          Oops! That page is missing, but our trending products aren’t.
        </p>

        <button className="home-btn" onClick={onGoHome}>
          GO BACK TO HOME →
        </button>
      </div>
    </div>
  );
};

export default NotFound;
