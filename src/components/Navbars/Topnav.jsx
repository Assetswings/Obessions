import React, { useState } from "react";
import "./HorizontalNavBar.css";
import MegaMenu from "./MegaMenu";
import { useNavigate } from "react-router-dom";

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
        <div className="nav-item" onClick={()=>handelroute("/new-arrivals")}>NEW ARRIVALS</div>
        <div className="nav-item" onClick={()=>handelroute("/bestseller")}>BESTSELLERS</div>
        <div className="nav-item" onClick={()=>handelroute("/offer-spot")}>OFFERS SPOT</div>
        <div className="nav-item" onClick={()=>handelroute("/carpet-finder")}>FLOOR MATCHER</div>
      </nav>
      {showMegaMenu && <MegaMenu closeMenu={() => setShowMegaMenu(false)} />}
    </>
  );
};

export default Topnav;
