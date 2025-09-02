import React, { useState } from "react";
import "./HorizontalNavBar.css";
import MegaMenu from "./MegaMenu";
import { useNavigate } from "react-router-dom";

const Topnav = () => {
const [showMegaMenu, setShowMegaMenu] = useState(false);
  const navigate = useNavigate();
   const handelcarpet =()=>{
    navigate("/carpet-finder")
   }
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
        <div className="nav-item" onClick={handelcarpet}>FLOOR MATCHER</div> 
      </nav>
      {showMegaMenu && <MegaMenu closeMenu={() => setShowMegaMenu(false)} />}
    </>
  );
};

export default Topnav;
