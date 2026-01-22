import React from "react";
import "./NotFound.css";
import { Link } from "react-router-dom";
import bin from "../../assets/images/Bin.png";
const NotFound = ({ onGoHome }) => {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <div className="notfound-404">
          <span>4</span>
          <img
            src={bin}
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
          <Link to='/'>GO BACK TO HOME →</Link>
        </button>
      </div>
    </div>
  );
};

export default NotFound;
