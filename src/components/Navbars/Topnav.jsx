import React, { useState } from "react";
import "./HorizontalNavBar.css";
import MegaMenu from "./MegaMenu";
import { Link, useNavigate } from "react-router-dom";

const Topnav = () => {
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const navigate = useNavigate();
  const handelroute = (route) => {
    navigate(route);
  };
  return (
    <>
      <nav className="horizontal-nav-bar">
        <div
          className="nav-item"
          onMouseEnter={() => setShowMegaMenu(true)}
        >
          SHOP
        </div>
        <div className="nav-item">
          <Link to='/new-arrivals'>NEW ARRIVALS</Link>
        </div>
        <div className="nav-item">
          <Link to='/bestseller'>BEST SELLERS</Link>
        </div>
        <div className="nav-item">
          <Link to='/offer-spot'>OFFERS SPOT</Link>
        </div>
        <div className="nav-item">
          <Link to='/carpet-finder'>FLOOR MATCHER</Link>
        </div>
      </nav>
      {showMegaMenu && <MegaMenu closeMenu={() => setShowMegaMenu(false)} />}
    </>
  );
};

export default Topnav;
