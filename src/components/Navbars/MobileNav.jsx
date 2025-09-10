import React, { useState } from "react";
import "./MobileNav.css";
import { Heart, CircleUser, ShoppingCart } from "lucide-react";
import mobilelogo from "../../assets/images/Logomobile.png"; 

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleWishlistClick = () => {
    console.log("Wishlist clicked");
  };

  const handleCartClick = () => {
    console.log("Cart clicked");
  };

  return (
    <>
      {/* Top bar */}
      <header className="topbar">
        <div className="hamburger" onClick={toggleDrawer}>
          <span></span>
          <span></span>
        </div>
    <div className="mobile_logo_track"> 
    <img src={mobilelogo}  width={140}/>   
       </div>  
       
        <div className="icons">
          <CircleUser
            strokeWidth={1}
            color="#FFFFFF"
            size={25}
            style={{ cursor: "pointer" }}
          />
          <Heart
            strokeWidth={1}
            size={25}
            onClick={handleWishlistClick}
            style={{ cursor: "pointer" }}
          />
          <ShoppingCart
            onClick={handleCartClick}
            strokeWidth={1}
            size={25}
            style={{ cursor: "pointer" }}
          />
        </div>
      </header>

      {/* Drawer */}
      <div className={`drawer ${isOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <h2>Menu</h2>
          <span onClick={toggleDrawer} style={{ cursor: "pointer" }}>
            ✕
          </span>
        </div>
        <ul>
          <li>Home</li>
          <li>Shop</li>
          <li>Collections</li>
          <li>About Us</li>
          <li>Contact</li>
        </ul>
      </div>

      {/* Overlay */}
      {isOpen && <div className="overlay" onClick={toggleDrawer}></div>}
    </>
  );
};

export default MobileNav;
