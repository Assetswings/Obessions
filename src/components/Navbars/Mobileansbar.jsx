import React, { useEffect, useRef, useState } from "react";
import {
  Heart,
  CircleUser,
  ShoppingCart,
  User,
  LogOut,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import WishlistModal from "../Wishtlist/WishlistModal";
import LoginPromptModal from "../LoginModal/LoginPromptModal";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "./Mobileansbar.css";

const Mobileansbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("right");

  const navigate = useNavigate();
  const location = useLocation();
  const userWrapperRef = useRef(null);

  
  // ✅ Check login status
  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    checkLogin();
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  // ✅ Close popup when clicking outside
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

  // ✅ Fetch banner data
  useEffect(() => {
    axios
      .get("https://apis-staging.obsessions.co.in/v1/banners/announce-bar", {
        headers: { accept: "application/json" },
      })
      .then((response) => {
        if (response.data?.data) {
          setBanners(response.data.data);
        }
      })
      .catch((error) => console.error("Error fetching banner:", error));
  }, []);

  // ✅ Auto slide every 6s
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setSlideDirection("right");
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [banners]);

  const handleNext = () => {
    setSlideDirection("right");
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setSlideDirection("left");
    setCurrentIndex((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  // ✅ Show user menu
  const handleUserClick = (e) => {
    e.stopPropagation(); // prevent outside click event
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
      style: { border: "1px solid #713200", padding: "16px", color: "#713200" },
      iconTheme: { primary: "#713200", secondary: "#FFFAEE" },
      hideProgressBar: true,
      closeButton: true,
      icon: true,
    });
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  const handleProfile = () => {
    setShowUserPopup(false);
    navigate("/ProfilePage");
  };

  const handleWishlistClick = () => {
    if (isLoggedIn) setShowWishlist(true);
    else setShowLoginPrompt(true);
  };

  const handleCartClick = () => {
    if (isLoggedIn) navigate("/cart");
    else setShowLoginPrompt(true);
  };

  return (
    <>
      <ToastContainer
        style={{ zIndex: 9999999999999 }}
        position="top-right"
        autoClose={3000}
      />

      <div className="top-announcement-bar-mlb">
        <div className="box_domain">
          {banners.length > 1 && (
            <div className="arrow-btn" onClick={handlePrev}>
              <ChevronLeft strokeWidth={1} />
            </div>
          )}

          <div
            key={currentIndex}
            className={`announce-text-mlb slide-${slideDirection}`}
          >
            {banners.length > 0 ? (
              <a
                className="txt_bar"
                href={`#${banners[currentIndex]?.action_url}`}
                rel="noopener noreferrer"
              >
                {banners[currentIndex]?.title}
              </a>
            ) : (
              "Loading announcements..."
            )}
          </div>

          {banners.length > 1 && (
            <div className="arrow-btn" onClick={handleNext}>
              <ChevronRight strokeWidth={1} />
            </div>
          )}
        </div>

      
      </div>

      {showWishlist && <WishlistModal onClose={() => setShowWishlist(false)} />}
      {showLoginPrompt && (
        <LoginPromptModal onClose={() => setShowLoginPrompt(false)} />
      )}
    </>
  );
};

export default Mobileansbar;
