import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Breadcrumbs.css";

  const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="breadcrumb-wrapper">
      <Link to="/" className="breadcrumb-item">
        HOME
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;

        const formatted = decodeURIComponent(value)
          .replace(/-/g, " ")
          .toUpperCase();

        return (
          <span key={to} className="breadcrumb-segment">
            <span className="breadcrumb-separator">›</span>
            {isLast ? (
              <span className="breadcrumb-item active">{formatted}</span>
            ) : (
              <Link to={to} className="breadcrumb-item">
                {formatted}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
