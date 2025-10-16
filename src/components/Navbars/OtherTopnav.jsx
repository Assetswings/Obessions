import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import {
  Heart,
  CircleUser,
  ShoppingCart,
  User,
  LogOut,
  Search,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import MegaMenu from "./MegaMenu";
import MegamenuDuo from "./MegamenuDuo";
import WishlistModal from "../Wishtlist/WishlistModal";
import "./OtherTopnav.css";
import logo from "../../assets/icons/Obslogo.png";
import LoginPromptModal from "../LoginModal/LoginPromptModal";
import {
  fetchSearchResults,
  clearSearchResults,
} from "../../pages/Home/searchSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

const OtherTopnav = () => {
  const dispatch = useDispatch();
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const userWrapperRef = useRef(null);
  const inputRef = useRef(null);
  const searchState = useSelector((state) => state.search || {});
  const { results = [], loading, error } = searchState;

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

  useEffect(() => {
    if (!query.trim()) {
      dispatch(clearSearchResults());
      return;
    }
    const timeoutId = setTimeout(() => {
      dispatch(fetchSearchResults(query));
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [query, dispatch]);

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
    // navigate("/");
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

  const handelroute = (route) => {
    navigate(route);
  };

  const claersearch = () => {
    setShowSearch(false);
    dispatch(clearSearchResults);
    setQuery("");
  };

  return (
    <>
      <ToastContainer style={{ zIndex: 9999999999999 }} position="top-right" autoClose={3000} />
      <nav className="other-topnav">

        <div
          className="nav-logo"
          onClick={handleLogoClick}
          style={{ cursor: "pointer" }}>
          <img src={logo} alt="Logo" />
        </div>


        <ul className="nav-links">
          <li onMouseEnter={() => setShowMegaMenu(true)}>SHOP</li>
          <li onClick={() => handelroute("/new-arrivals")}>NEW ARRIVALS</li>
          <li onClick={() => handelroute("/bestseller")}>BEST SELLERS</li>
          <li onClick={() => handelroute("/offer-spot")}>OFFERS SPOT</li>
          <li onClick={() => handelroute("/carpet-finder")}>CARPET FINDER</li>
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

      <div style={{ height: "50px" }}></div>
      {/* <div style={{height:"60px"}}></div> */}

      {showMegaMenu && (
        <div className="megamenu-wrapper">
          <MegamenuDuo closeMenu={() => setShowMegaMenu(false)} />
        </div>
      )}

      {showWishlist && <WishlistModal onClose={() => setShowWishlist(false)} />}
      {showLoginPrompt && (
        <LoginPromptModal onClose={() => setShowLoginPrompt(false)} />
      )}

      {/* 🔹 Fullscreen Search Modal */}
      {showSearch && (
        <div className="search-overlay" onClick={() => claersearch()}>
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
                onChange={(e) => setQuery(e.target.value)}
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
                  navigate("/searchlist", {
                    state: { query: query },
                  });
                }}
              >
                <Search strokeWidth={1.25} />
              </button>
            </div>

            {Array.isArray(results) && results.length > 0 && (
              <div className="search-results-grid-other">
                {results.slice(0, 8).map((item, index) => (
                  <div
                    key={index}
                    className="search-card"
                    onClick={() => {
                      claersearch();
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
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default OtherTopnav;
