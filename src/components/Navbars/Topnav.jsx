import React, { useState } from "react";
import "./HorizontalNavBar.css";
import MegaMenu from "./MegaMenu";

const Topnav = () => {
const [showMegaMenu, setShowMegaMenu] = useState(false);
return (
        <>
        <nav className="horizontal-nav-bar">
        <div
          className="nav-item"
          onClick={() => setShowMegaMenu((prev) => !prev)}>
          SHOP
         </div>
        <div className="nav-item">NEW ARRIVALS</div>
        <div className="nav-item">BESTSELLERS</div>
        <div className="nav-item">OFFERS SPOT</div>
        <div className="nav-item">FLOOR MATCHER</div>
      </nav>
      {showMegaMenu && <MegaMenu closeMenu={() => setShowMegaMenu(false)} />}
    </>
  );
};

export default Topnav;
