import React, { useState, useEffect, useRef } from "react";
import "./MobileNav.css";
import {
  CircleUser,
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  Search,
  X,
  User,
  LogOut,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import mobilelogo from "../../assets/icons/Black.png";
import { fetchMegamenuData } from "./megamenuSlice";
import { Link, useNavigate } from "react-router-dom";
import WishlistModal from "../Wishtlist/WishlistModal";
import LoginPromptModal from "../LoginModal/LoginPromptModal";
import Mobileansbar from "./Mobileansbar";
import { IoLogoWhatsapp } from "react-icons/io";
import newsdrwimage from "../../assets/images/navimage.png";
import API from "../../app/api";
import { useCartWishlist } from "../../app/CartWishlistContext";

const MobileNav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getCartWishlistCount } = useCartWishlist();
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("main");
  const [currentSection, setCurrentSection] = useState(null);
  const [openCategory, setOpenCategory] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const userWrapperRef = useRef(null);
  const { data } = useSelector((state) => state.megamenu);
  const [wdata, setData] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    chatsupport();
    dispatch(fetchMegamenuData());
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [dispatch]);

  useEffect(() => {
    if (isOpen) {
      // Disable page scroll when drawer is open
      document.body.style.overflow = "hidden";
    } else {
      // Enable scroll when drawer is closed
      document.body.style.overflow = "auto";
    }

    // Cleanup when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // ✅ Check login status dynamically
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
      if (userWrapperRef.current && !userWrapperRef.current.contains(event.target)) {
        setShowUserPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const chatsupport = async () => {
    try {
      const res = await API.get("/chat/support");
      if (res.data.status === 200) setData(res.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
    setActiveMenu("main");
    setCurrentSection(null);
    setOpenCategory(null);
  };

  const navigateTo = (menu) => setActiveMenu(menu);
  const goBack = () => {
    if (activeMenu === "category") {
      setActiveMenu("shop");
      setCurrentSection(null);
      setOpenCategory(null);
    } else if (activeMenu === "shop") {
      setActiveMenu("main");
    }
  };

  const toggleCategory = (id) => {
    setOpenCategory((prev) => (prev === id ? null : id));
  };

  const handleUserClick = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) navigate("/login");
    else setShowUserPopup((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    setShowUserPopup(false);
    getCartWishlistCount();
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  const handleProfile = () => {
    setShowUserPopup(false);
    navigate("/ProfilePage");
  };

  useEffect(() => {
    if (!query.trim()) {
      setSearchData([]);
      return;
    }
    const timeoutId = setTimeout(() => {
      setLoading(true);
      handleSearch(query);
    }, 400);

    return () => clearTimeout(timeoutId);
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
    if (showSearch && inputRef.current) inputRef.current.focus();
    document.body.style.overflow = showSearch ? "hidden" : "auto";
  }, [showSearch]);

  const clearSearch = () => {
    setShowSearch(false);
    setQuery("");
    setSearchData([]);
  };

  const getMenuTitle = () => {
    if (activeMenu === "main") return "";
    if (activeMenu === "shop") return "SHOP";
    if (activeMenu === "category") return currentSection?.name || "";
    return "";
  };

  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <div className="hamburger" onClick={toggleDrawer}>
            <span></span>
            <span></span>
          </div>

          <div className="mobile_logo_track" onClick={() => navigate("/")}>
            <img src={mobilelogo} width={105} alt="logo" />
          </div>
        </div>

        <div className="icons">
          <Search
            color="black"
            strokeWidth={1.5}
            onClick={() => setShowSearch(true)}
            className="search-icon"
          />
          <div ref={userWrapperRef} className="user-click-wrapper">
            <CircleUser
              strokeWidth={1.5}
              color="black"
              size={25}
              onClick={handleUserClick}
            />
            {isLoggedIn && showUserPopup && (
              <div
                className="user-popup_AN"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="popup-triangle_mlb"></div>
                <div className="popup-item" onClick={handleProfile}>
                  <User size={20} style={{ marginRight: 8 }} />
                  <span>Profile</span>
                </div>
                <div className="popup-item" onClick={handleLogout}>
                  <LogOut size={18} style={{ marginRight: 8 }} />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <Mobileansbar />

      <div className={`drawer ${isOpen ? "open" : ""}`}>
        <div className="drawer-header">
          {activeMenu !== "main" && (
            <span className="back-btn" onClick={goBack}>
              <ChevronLeft />
            </span>
          )}
          {/* 🚀 Add this title */}
          {activeMenu !== "main" && (
            <span className="drawer-title">{getMenuTitle()}</span>
          )}
          <div className="track_sector_close">
            <span onClick={toggleDrawer} className="close-btn-mlb">
              ✕
            </span>
          </div>
        </div>

        <div className="menu-container">
          {/* ===== MAIN MENU ===== */}
          <div className={`menu ${activeMenu === "main" ? "active" : ""}`}>
            <ul>
              <li onClick={() => navigateTo("shop")} className="border-buttom">
                <div className="iteam_main">
                  <div>Shop</div>
                  <div>
                    <ChevronRight />
                  </div>
                </div>
              </li>
              <li className="border-buttom">
                <Link to="/new-arrivals" onClick={toggleDrawer}>
                  NEW ARRIVALS
                </Link>
              </li>
              <li className="border-buttom">
                <Link to="/bestseller" onClick={toggleDrawer}>
                  BEST SELLERS
                </Link>
              </li>
              <li className="border-buttom">
                <Link to="/offer-spot" onClick={toggleDrawer}>
                  OFFERS SPOT
                </Link>
              </li>
              <li className="border-buttom">
                <Link to="/carpet-finder" onClick={toggleDrawer}>
                  FLOOR MATCHER
                </Link>
              </li>
            </ul>

            {/* 🔥 Image after all text content */}
            <div className="drawer-image">
              <img src={newsdrwimage} alt="Menu Banner" />
            </div>
          </div>

          {/* ===== SHOP MENU ===== */}
          <div className={`menu ${activeMenu === "shop" ? "active" : ""}`}>
            <ul>
              {data?.map((section) => (
                <li
                  key={section.id}
                  onClick={() => {
                    setCurrentSection(section);
                    navigateTo("category");
                  }}
                >
                  <div className="iteam_main border-buttom">
                    <div>{section.name}</div>
                    <div>
                      <ChevronRight />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* ===== CATEGORY MENU ===== */}
          <div className={`menu ${activeMenu === "category" ? "active" : ""}`}>
            <ul>
              {currentSection?.categories?.map((category) => (
                <li key={category.id}>
                  <div
                    className="iteam_main"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <div>{category.name}</div>
                    <div className="toggle-icon">
                      {openCategory === category.id ? <Minus /> : <Plus />}
                    </div>
                  </div>
                  {openCategory === category.id && (
                    <ul className="submenu">
                      {category.subcategories.map((sub) => (
                        <li key={sub.id}>
                          <Link
                            to={`/products/${category.action_url}/${sub.action_url}`}
                            onClick={toggleDrawer}
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {isOpen && <div className="overlay" onClick={toggleDrawer}></div>}

      {showWishlist && <WishlistModal onClose={() => setShowWishlist(false)} />}
      {showLoginPrompt && (
        <LoginPromptModal onClose={() => setShowLoginPrompt(false)} />
      )}

      {showSearch && (
        <div className="search-fullscreen" onClick={clearSearch}>
          <div
            className="search-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            {/* TOP SEARCH BAR */}

            <div className="search-header">
              <Search size={20} strokeWidth={1.4} />
              <input
                ref={inputRef}
                type="text"
                className="search-input"
                placeholder="WHAT ARE YOU LOOKING FOR ?"
                value={query}
                onChange={(e) => {
                  let value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
                  value = value.replace(/^\s+/, "");
                  setQuery(value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query.trim()) {
                    clearSearch();
                    navigate("/searchlist", { state: { query } });
                  }
                }}
              />

              <X className="close-search" onClick={clearSearch} />
            </div>

            {/* RESULTS / LOADER */}
            {loading ? (
              <div className="loader-box">
                <div className="spinner-border text-secondary" />
              </div>
            ) : (
              <>
                {Array.isArray(searchData) && searchData.length > 0 && (
                  <div className="search-results-wrapper">
                    {searchData.slice(0, 8).map((item, i) => (
                      <Link
                        to={`/productsdetails/${item.action_url}`}
                        className="search-result-row"
                        key={i}
                        onClick={clearSearch}
                      >
                        <img
                          src={item.media_list?.main?.file}
                          alt={item.name}
                          className="result-thumb"
                        />
                        <div className="result-info">
                          <p>{item.name}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {!loading && query.trim() && searchData.length === 0 && (
                  <div className="no-result-box">
                    <p>No results found</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
      <a
        href={`https://api.whatsapp.com/send?phone=${wdata?.phone}&text=${wdata?.text}`}
        className="floating-whatsapp"
        target="_blank"
        rel="noopener noreferrer"
      >
        <IoLogoWhatsapp className="whatsapp-icon" />
      </a>
    </>
  );
};

export default MobileNav;
