import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { Heart, CircleUser, ShoppingCart } from "lucide-react";
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
  };

  const handleProfile = () => {
    setShowUserPopup(false);
    navigate("/ProfilePage");
  };

  const handleLogin = () => {
    setShowUserPopup(false);
    navigate("/login");
  };

  // const LoginPromptModal = () => (
  //   <div className="login-prompt-backdrop">
  //     <div className="login-prompt-modal">
  //       <p>Please login to continue</p>
  //       <button onClick={() => navigate("/login")}>Login</button>
  //       <button onClick={() => setShowLoginPrompt(false)}>Cancel</button>
  //     </div>
  //   </div>
  // );

  return (
    <>
      <nav className="other-topnav">
        <div className="nav-logo" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
          <img src={logo} alt="Logo" />
        </div>

        <ul className="nav-links">
          <li onClick={() => setShowMegaMenu(prev => !prev)}>SHOP</li>
          <li>NEW ARRIVALS</li>
          <li>BEST SELLERS</li>
          <li>OFFERS SPOT</li>
          <li>CARPET FINDER</li>
        </ul>

        <div className="nav-actions">
          <div className="search-bar">
            <input type="text" placeholder="Search" />
            <button><FaSearch /></button>
          </div>

          {/* User Icon and Popup */}
          <div
            ref={userWrapperRef}
            className="user-hover-wrapper"
            onMouseLeave={() => setShowUserPopup(false)}
            onMouseEnter={() => setShowUserPopup(true)}
          >
            <CircleUser
              strokeWidth={1}
              color="#FFFFFF"
              size={25}
              style={{ cursor: "pointer" }}
              onClick={() => setShowUserPopup((prev) => !prev)}
            />

            {showUserPopup && (
              <>
                <div className="popup-triangle"></div>
                <div
                  className="user-popup"
                  onMouseEnter={() => setShowUserPopup(true)}
                  onMouseLeave={() => setShowUserPopup(false)}
                >
                  {isLoggedIn ? (
                    <>
                      <div className="popup-item" onClick={handleProfile}>
                        <CircleUser size={16} style={{ marginRight: 8 }} />
                        <span>Profile</span>
                      </div>
                      <div className="popup-item" onClick={handleLogout}>
                        <span style={{ transform: 'rotate(180deg)', display: 'inline-block', marginRight: 8 }}>↩</span>
                        <span>Logout</span>
                      </div>
                    </>
                  ) : (
                    <button className="popup-login-btn" onClick={handleLogin}>Sign In</button>
                  )}
                </div>
              </>
            )}
          </div>

          <Heart strokeWidth={1} size={25} onClick={handleWishlistClick} style={{ cursor: "pointer" }} />
          <ShoppingCart onClick={handleCartClick} strokeWidth={1} size={25} style={{ cursor: "pointer" }} />
        </div>
      </nav>

      {showMegaMenu && (
        <div className="megamenu-wrapper">
          <MegaMenu closeMenu={() => setShowMegaMenu(false)} />
        </div>
      )}

      {showWishlist && <WishlistModal onClose={() => setShowWishlist(false)} />}
      {showLoginPrompt && <LoginPromptModal onClose={() => setShowLoginPrompt(false)} />}
    </>
  );
};

export default OtherTopnav;
