import React, { useEffect, useRef, useState } from "react";
import {
  Heart,
  CircleUser,
  ShoppingCart,
  User,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Search,
} from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import WishlistModal from "../Wishtlist/WishlistModal";
import LoginPromptModal from "../LoginModal/LoginPromptModal";
import axios from "axios";
import "./TopAnnouncementBar.css";
import API from "../../app/api";
import { useCartWishlist, useHeader } from "../../app/CartWishlistContext";
import { useDispatch } from "react-redux";
import searchicon from "../../assets/icons/Searchicon.svg";

const TopAnnouncementBar = () => {
  const dispatch = useDispatch();
  const { countData } = useCartWishlist();
  const { showSearchIcon } = useHeader();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("right");
  const [showSearch, setShowSearch] = useState(false);
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (!query.trim()) {
      setSearchData([]);
      return;
    }
    setLoading(true);
    handleSearch(query);
  }, [query, dispatch]);

  const handleSearch = async (query) => {
    try {
      const res = await API.get(`search?q=${query}`);
      if (res.data.status === 200) {
        setLoading(false);
        setSearchData(res.data?.data?.products);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showSearch) {
      // Focus input automatically
      if (inputRef.current) {
        inputRef.current.focus();
      }
      // Block scroll
      document.body.style.overflow = "hidden";
    } else {
      // Restore scroll
      document.body.style.overflow = "auto";
    }

    // Cleanup when unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showSearch]);

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
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    setShowUserPopup(false);
    // toast.success("Logout Successfully.", {
    //   style: { borderRadius:"inherit", padding: "16px", color: "#713200" },
    //   iconTheme: { primary: "#713200", secondary: "#FFFAEE" },
    //   hideProgressBar: true,
    //   closeButton: true,
    //   icon: true,
    // });
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  const handleWishlistClick = () => {
    if (isLoggedIn) setShowWishlist(true);
    else setShowLoginPrompt(true);
  };

  const handleCartClick = (e) => {
    const token = localStorage.getItem("token");
    if (!token) {
      e.preventDefault(); // Stop <Link> navigation
      // Show your login modal or redirect
      setShowLoginPrompt(true);
    }
  };

  // Search login 
  const claersearch = () => {
    setShowSearch(false);
    setQuery("");
    setSearchData([]);
  };

  return (
    <>
      {/* <ToastContainer
        style={{ zIndex: 9999999999999 }}
        position="top-right"
        autoClose={3000}
      /> */}

      <div className="top-announcement-bar">
        <div className="box_domain">
          {banners.length > 1 && (
            <div className="arrow-btn" onClick={handlePrev}>
              <ChevronLeft strokeWidth={1} />
            </div>
          )}

          <div
            key={currentIndex}
            className={`announce-text slide-${slideDirection}`}
          >
            {banners.length > 0 ? (
              <a
                href={`${banners[currentIndex]?.action_url}`}
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

        <div className="icons-ann">
          {showSearchIcon && (
            <img src={searchicon} alt="search" onClick={() => setShowSearch(true)} className="pointer-crusser search-icon-ann" />
          )}
          <div
            ref={userWrapperRef}
            className="user-click-wrapper"
            style={{ position: "relative", left:'7px', top:'0px' }}
            title="User Profile"
            onClick={handleUserClick}
          >
            <span style={{ fontSize: "12px", paddingRight: "7px" }}>{localStorage.getItem('userName') ?? ''}</span>
            <CircleUser
              color="#FFFFFF"
              size={26}
              strokeWidth={1}
              style={{ cursor: "pointer" }}
            />

            {/* ✅ Fixed Popup */}
            {isLoggedIn && showUserPopup && (
              <div
                className="user-popup_AN_al"
                onClick={(e) => e.stopPropagation()} // prevent close on inside click
              >
                <div className="popup-triangle_an"></div>
                <div className="popup-item">
                  <Link to='/ProfilePage'>
                    <User size={26} style={{ marginRight: 8 }} />
                    <span>Profile</span>
                  </Link>
                </div>
                <div className="popup-item" onClick={handleLogout}>
                  <LogOut size={26} style={{ marginRight: 8 }} />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>

          <div title="Wish List">
            <Heart
              size={26}
              onClick={handleWishlistClick}
              style={{ cursor: "pointer" }}
              strokeWidth={1}
              title="Wishlist"
            />
            <span className="wishlist-badge" style={{ right: "33px" }}>
              <span style={{ position: 'relative', top: '1px' }}>
                {countData?.wishlist_count ?? ''}
              </span>
            </span>
          </div>

          <div title="Cart">
            <Link to="/cart" onClick={handleCartClick} style={{ position: "relative" }}>
              <ShoppingCart
                size={26}
                style={{ cursor: "pointer" }}
                strokeWidth={1}
                title="Cart"
              />
              <span className="cart-badge" style={{ left: "85%", top: "-5px" }}>
                <span style={{ position: 'relative', top: '1px' }}> {countData?.cart_count ?? ""} </span>
              </span>
            </Link>
            {/* <ShoppingCart
              size={22}
              onClick={handleCartClick}
              style={{ cursor: "pointer" }}
              strokeWidth={1}
              title="Cart"
            />
            <span className="wishlist-badge" style={{ left: "93%" }}>{countData?.cart_count ?? ''}</span> */}
          </div>
        </div>
      </div>

      {/* 🔹 Fullscreen Search Modal */}
      {showSearch && (
        <div className="search-overlay" onClick={() => { claersearch(); setSearchData([]); }}>
          <div
            className="search-modal-other"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex">
              <input
                ref={inputRef}
                type="text"
                className="form-control border-0 input_global"
                placeholder="WHAT ARE YOU LOOKING FOR?"
                value={query}
                onChange={(e) => {
                  // Allow only letters, numbers, and spaces (no special characters)
                  let value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
                  // Remove leading spaces
                  value = value.replace(/^\s+/, "");
                  setQuery(value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query.trim()) {
                    claersearch();
                    setSearchData([]);
                    navigate("/searchlist", { state: { query } });
                  }
                }}
              // onFocus={handleFocus}
              />
              {loading && (
                <div style={{ backgroundColor: "white" }} className="sarchlader">
                  <div
                    className="spinner-border text-secondary"
                    style={{ width: "20px", height: "20px" }}
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
              <button
                className="btn btn-dark  button_search"
                disabled={!query?.trim()}
                onClick={() => {
                  claersearch();
                  setSearchData([]);
                  navigate("/searchlist", {
                    state: { query: query },
                  });
                }}
              >
                <Search strokeWidth={1.25} />
              </button>
            </div>

            {Array.isArray(searchData) && (
              <>
                {searchData.length > 0 ? (
                  <div className="search-results-grid-other">
                    {searchData.slice(0, 8).map((item, index) => (
                      <div
                        key={index}
                        className="search-card"
                        onClick={() => {
                          claersearch();
                          setSearchData([]);
                        }}>
                        <Link to={`/productsdetails/${item.action_url}`} target="_blank" rel="noopener noreferrer">
                          <img
                            src={item.media_list?.main?.file}
                            alt={item.name}
                            className="search-card-img"
                          />
                          <div className="search-card-body">
                            <h6 className="search-card-title">
                              {item.name.split(" ").slice(0, 5).join(" ")}
                            </h6>
                          </div>

                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  // ✅ No Data Found message 
                  !loading && query?.trim() && (
                    <div className="no-data-found-top">
                      <p>No Result found</p>
                    </div>
                  )
                )}
              </>
            )}
          </div>
        </div>
      )}

      {showWishlist && <WishlistModal onClose={() => setShowWishlist(false)} />}
      {showLoginPrompt && (
        <LoginPromptModal onClose={() => setShowLoginPrompt(false)} />
      )}
    </>
  );
};

export default TopAnnouncementBar;
