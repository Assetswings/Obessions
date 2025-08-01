import React from "react";
import Marquee from "react-fast-marquee";
// import { FaHeart, FaUser, FaShoppingCart } from "react-icons/fa";
import { Heart, CircleUser, ShoppingCart } from "lucide-react";
import "./TopAnnouncementBar.css";

  const TopAnnouncementBar = () => {
  return (
    <div className="top-announcement-bar">
      <div className="scrolling-text">
        <Marquee pauseOnHover gradient={false} speed={60}>
          FRESH THEMES UPTO 50% OFF - SHOP NOW &nbsp; • &nbsp; REDEFINE YOUR
          FLOOR WITH BOLD BEAUTIFUL SHAPES &nbsp; • &nbsp; RUG REFRESH TIME UPTO
          50% OFF - SHOP NOW &nbsp; • &nbsp; REDEFINE YOUR FLOOR WITH BOLD
          BEAUTIFUL SHAPES &nbsp; • &nbsp; RUG REFRESH TIME UPTO 50% OFF - SHOP
          NOW &nbsp; • &nbsp; REDEFINE YOUR FLOOR WITH BOLD BEAUTIFUL SHAPES
        </Marquee>
      </div>
      <div className="icons">
        <CircleUser size={27} />
        <Heart size={27} />
        <ShoppingCart size={27} />
      </div>
    </div>
  );
};

export default TopAnnouncementBar;
