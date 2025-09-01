import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { Heart, CircleUser, ShoppingCart, User, LogOut, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MegaMenu from "./MegaMenu";
import WishlistModal from "../Wishtlist/WishlistModal";
import "./OtherTopnav.css";
import logo from "../../assets/icons/Obslogo.png";
import LoginPromptModal from "../LoginModal/LoginPromptModal";

  const OtherTopnav = () => {
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showSearch, setShowSearch] = useState(false); 
  const navigate = useNavigate();
  const userWrapperRef = useRef(null);

     useEffect(() => {
     const token = localStorage.getItem("token");
     setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userWrapperRef.current &&
        !userWrapperRef.current.contains(event.target)
      ) {
        setShowUserPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoClick = () => navigate("/");
  const handleCartClick = () => {
    if (isLoggedIn) {
      navigate("/cart");
    } else {
      setShowLoginPrompt(true);
    }
  };

  const handleWishlistClick = () => {
    if (isLoggedIn) {
      setShowWishlist(true);
    } else {
      setShowLoginPrompt(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setShowUserPopup(false);
    alert("Logout successful");
     navigate("/");
  };

  const handleProfile = () => {
    setShowUserPopup(false);
    navigate("/ProfilePage");
  };

  const handleUserClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      setShowUserPopup((prev) => !prev);
    }
  };

  const handelcarpet = () => {
    navigate("/carpetfinder");
  };

  return (
    <>
      <nav className="other-topnav">
        <div
          className="nav-logo"
          onClick={handleLogoClick}
          style={{ cursor: "pointer" }}
        >
          <img src={logo} alt="Logo" />
        </div>

        <ul className="nav-links">
          <li onClick={() => setShowMegaMenu((prev) => !prev)}>SHOP</li>
          <li>NEW ARRIVALS</li>
          <li>BEST SELLERS</li>
          <li>OFFERS SPOT</li>
          <li onClick={handelcarpet}>CARPET FINDER</li>
        </ul>

        <div className="nav-actions">
          <div className="search-bar">
            <button onClick={() => setShowSearch(true)}>
              <FaSearch />
            </button>
          </div>

          {/* User Icon */}
          <div
            ref={userWrapperRef}
            className="user-click-wrapper"
            onClick={handleUserClick}
            style={{ position: "relative" }}
          >
            <CircleUser
              strokeWidth={1}
              color="#FFFFFF"
              size={25}
              style={{ cursor: "pointer" }}
            />

            {isLoggedIn && showUserPopup && (
              <>
                <div className="popup-triangle"></div>
                <div className="user-popup">
                  <div className="popup-item" onClick={handleProfile}>
                    <User size={22} style={{ marginRight: 8 }} />
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
      </nav>

      {showMegaMenu && (
        <div className="megamenu-wrapper">
          <MegaMenu closeMenu={() => setShowMegaMenu(false)} />
        </div>
      )}

      {showWishlist && <WishlistModal onClose={() => setShowWishlist(false)} />}
      {showLoginPrompt && (
        <LoginPromptModal onClose={() => setShowLoginPrompt(false)} />
      )}

      {/* 🔹 Fullscreen Search Modal */}
      {showSearch && (
        <div className="search-overlay" onClick={() => setShowSearch(false)}>
          <div
            className="search-modal"
            onClick={(e) => e.stopPropagation()} // prevent closing on modal click
          >
          
            <div className="d-flex">
            <input
              type="text"
              className="form-control border-0 rounded-5 input_global"
              placeholder="WHAT ARE YOU LOOKING FOR?"
              // value={query}
            />
            <button
              className="btn btn-dark rounded-5 button_search"
              // onClick={() =>
              //   navigate("/searchlist", {
              //     state: { query: query },
              //   })
              // }
            >
              <Search strokeWidth={1.25} />
            </button>
          </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OtherTopnav;
