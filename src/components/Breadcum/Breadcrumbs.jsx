// Breadcrumbs.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Breadcrumbs.css";

const Breadcrumbs = ({ paths = [] }) => {
  return (
    <nav className="breadcrumb-wrapper">
      <Link to="/" className="breadcrumb-item">
        HOME
      </Link>

      {paths.map((item, index) => {
        const isLast = index === paths.length - 1;

        return (
          <span key={index} className="breadcrumb-segment">
            <span className="breadcrumb-separator">›</span>
            {isLast ? (
              <span className="breadcrumb-item active">{item.label}</span>
            ) : (
              <Link to={item.to} className="breadcrumb-item">
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
