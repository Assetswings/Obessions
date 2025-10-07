import React, { useEffect, useRef, useState } from "react";
import Marquee from "react-fast-marquee";
import { Heart, CircleUser, ShoppingCart, User, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import WishlistModal from "../Wishtlist/WishlistModal";
import LoginPromptModal from "../LoginModal/LoginPromptModal";
import "./TopAnnouncementBar.css";
import { toast, ToastContainer } from "react-toastify";

const TopAnnouncementBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userWrapperRef = useRef(null);

    useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    }, [location.pathname]);
    
     useEffect(() => {
     const handleClickOutside = (event) => {
        if (
        userWrapperRef.current &&
        !userWrapperRef.current.contains(event.target)
      ){
        setShowUserPopup(false);
      }
      };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUserClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      setShowUserPopup((prev) => !prev);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setShowUserPopup(false);
    toast.success("Logout Successfully.", {
      style: {
        border: "1px solid #713200",
        padding: "16px",
        color: "#713200",
      },
      iconTheme: {
        primary: "#713200",
        secondary: "#FFFAEE",
      },
      hideProgressBar: true,
      closeButton: true,
      icon: true,
    });
  };

  const handleProfile = () => {
    setShowUserPopup(false);
    navigate("/ProfilePage");
  };

  const handleWishlistClick = () => {
    if (isLoggedIn) {
      setShowWishlist(true);
    } else {
      setShowLoginPrompt(true);
    }
  };

  const handleCartClick = () => {
    if (isLoggedIn) {
      navigate("/cart");
    } else {
      setShowLoginPrompt(true);
    }
  };

  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
      <div className="top-announcement-bar">
        <div className="scrolling-text">
          <Marquee pauseOnHover gradient={false} speed={60}>
            FRESH THEMES UPTO 50% OFF - SHOP NOW &nbsp; • &nbsp; REDEFINE YOUR
            FLOOR WITH BOLD BEAUTIFUL SHAPES &nbsp; • &nbsp; RUG REFRESH TIME
            UPTO 50% OFF - SHOP NOW &nbsp; • &nbsp; REDEFINE YOUR FLOOR WITH
            BOLD BEAUTIFUL SHAPES &nbsp; • &nbsp; RUG REFRESH TIME UPTO 50% OFF
            - SHOP NOW &nbsp; • &nbsp; REDEFINE YOUR FLOOR WITH BOLD BEAUTIFUL
            SHAPES
          </Marquee>
        </div>

        <div className="icons">
          {/* User Icon */}
          <div
            ref={userWrapperRef}
            className="user-click-wrapper"
            onClick={handleUserClick}
            title="User Profile"
            // style={{ position: "relative" }}
          >
            <CircleUser
              color="#FFFFFF"
              size={27}
              style={{ cursor: "pointer" }}
              strokeWidth={1} 
            />

            {isLoggedIn && showUserPopup && (
              <>
                <div className="popup-triangle"></div>
                <div className="user-popup_AN">
                  <div className="popup-item" onClick={handleProfile}>
                  <User size={22} style={{ marginRight: 8 }}/>
                    <span>Profile</span>
                  </div>
                  <div className="popup-item" onClick={handleLogout}>
                    <span
                      style={{
                        transform: "rotate(180deg)",
                        display: "inline-block",
                        marginRight: 8,
                      }}
                    >
                       <LogOut size={22} />
                    </span>
                    <span>Logout</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Wishlist Icon */}
          <Heart
            size={27}
            onClick={handleWishlistClick}
            style={{ cursor: "pointer" }}
            strokeWidth={1} 
            title="Wishlist"
          />

          {/* Cart Icon */}
          <ShoppingCart
            size={27}
            onClick={handleCartClick}
            style={{ cursor: "pointer" }}
            strokeWidth={1} 
            title="Cart"
          />
        </div>
      </div>

      {showWishlist && <WishlistModal onClose={() => setShowWishlist(false)} />}
      {showLoginPrompt && (
        <LoginPromptModal onClose={() => setShowLoginPrompt(false)} />
      )}
    </>
  );
};

export default TopAnnouncementBar;
