import React, { useState, useEffect, useRef } from "react";
import "./MobileNav.css";
import { Heart, CircleUser, ShoppingCart, ChevronRight, ChevronLeft, Plus, Minus, User, LogOut, Search, } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import mobilelogo from "../../assets/icons/Black.png";
import { fetchMegamenuData } from "./megamenuSlice";
import { Link, useNavigate } from "react-router-dom";
import WishlistModal from "../Wishtlist/WishlistModal";
import LoginPromptModal from "../LoginModal/LoginPromptModal";
import Mobileansbar from "./Mobileansbar";
import { IoLogoWhatsapp } from "react-icons/io";
import API from "../../app/api";

const MobileNav = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("main");
  const [prevMenu, setPrevMenu] = useState(null);
  const [direction, setDirection] = useState("forward");
  const [currentSection, setCurrentSection] = useState(null); // selected section
  const [openCategory, setOpenCategory] = useState(null); // expanded category
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const userWrapperRef = useRef(null);
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.megamenu);
  const [wdata, setData] = useState("");
  useEffect(() => {
    chatsupport();
  }, []);
  const chatsupport = async () => {
    try {
      const res = await API.get("/chat/support");
      if (res.data.status === 200) {
        setTimeout(() => {
          setData(res.data?.data);
        }, 1000); // reduce delay (10s is too long for UX)
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (
  //       userWrapperRef.current &&
  //       !userWrapperRef.current.contains(event.target)
  //     ) {
  //       setShowUserPopup(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);
  useEffect(() => {
    dispatch(fetchMegamenuData());
  }, [dispatch]);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
    setActiveMenu("main");
    setPrevMenu(null);
    setCurrentSection(null);
    setOpenCategory(null);
  };

  const navigateTo = (menu) => {
    if (menu === activeMenu) return;
    setDirection("forward");
    setPrevMenu(activeMenu);
    setActiveMenu(menu);
  };

  const goBack = () => {
    setDirection("back");

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

  // Disable scroll when drawer is open
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (isOpen) {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
      body.style.position = "fixed";
      body.style.width = "100%";
    } else {
      html.style.overflow = "";
      body.style.overflow = "";
      body.style.position = "";
      body.style.width = "";
    }

    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
      body.style.position = "";
      body.style.width = "";
    };
  }, [isOpen]);

  const handelroute = (route) => {
    navigate(route);
  };

  //  Wish List Modal
  const handleWishlistClick = () => {
    toggleDrawer();
    if (isLoggedIn) {
      setShowWishlist(true);
    } else {
      setShowLoginPrompt(true);
    }
  };

  const handleWishlistClickHeader = () => {
    if (isLoggedIn) {
      setShowWishlist(true);
    } else {
      setShowLoginPrompt(true);
    }
  };

  // User Accunt
  const handleUserClick = () => {
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
    alert("Logout successful");
    navigate("/");
  };

  const handleProfile = () => {
    setShowUserPopup(false);
    navigate("/ProfilePage");
  };

  const handelAccountSidenav = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate("/ProfilePage");
    }
  };

  return (
    <>

      <header className="topbar">
        <div className="topbar-left">
          <div className="hamburger" onClick={toggleDrawer}>
            <span></span>
            <span></span>
          </div>

          <div className="mobile_logo_track" onClick={() => handelroute("/")}>
            <img src={mobilelogo} width={105} alt="logo" />
          </div>
        </div>

        <div className="icons">

          <Search
            color="black"
            strokeWidth={1.5}
          />
          <CircleUser
            ref={userWrapperRef}
            strokeWidth={1.5}
            color="black"
            size={25}
            onClick={handleUserClick}
          />
        </div>
      </header>

      <Mobileansbar />
      {/* Drawer */}
      <div className={`drawer ${isOpen ? "open" : ""}`}>
        <div className="drawer-header">
          {activeMenu !== "main" && (
            <span className="back-btn" onClick={goBack}>
              <ChevronLeft />
            </span>
          )}

          <>

            <div className="track_sector_close">
              <span onClick={toggleDrawer} className="close-btn-mlb" >
                ✕
              </span>
            </div>
          </>
        </div>

        <div className="menu-container">
          {/* Main Menu */}
          <div className={`menu ${activeMenu === "main" ? "active" : ""}`}>
            <ul>
              <li onClick={() => navigateTo("shop")}>
                <div className="iteam_main">
                  <div>Shop</div>
                  <div>
                    <ChevronRight />
                  </div>
                </div>
              </li>
              {/* <li onClick={() => handelroute("/new-arrivals")}>New Arrivals</li>
              <li onClick={() => handelroute("/bestseller")}>Best Sellers</li>
              <li onClick={() => handelroute("/offer-spot")}>Offers Spot</li>
              <li onClick={() => handelroute("/carpet-finder")}>
                Floor Matcher
              </li> */}
              <li>
                <Link to='/new-arrivals' onClick={toggleDrawer}>NEW ARRIVALS</Link>
              </li>
              <li>
                <Link to='/bestseller' onClick={toggleDrawer}>BEST SELLERS</Link>
              </li>
              <li>
                <Link to='/offer-spot' onClick={toggleDrawer}>OFFERS SPOT</Link>
              </li>
              <li>
                <Link to='/carpet-finder' onClick={toggleDrawer}>FLOOR MATCHER</Link>
              </li>
            </ul>
            <ul>
              <li onClick={handleWishlistClick}>Wishlist</li>
              <li onClick={() => handelroute("/cart")}>Cart</li>
              <li onClick={() => handelAccountSidenav()}>Account</li>
            </ul>
          </div>

          {/* Shop → Sections */}
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
                  <div className="iteam_main">
                    <div>{section.name}</div>
                    <div>
                      <ChevronRight />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Section → Categories (expandable) */}
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

                  {/* Expanded Subcategories */}
                  {openCategory === category.id && (
                    <ul className="submenu">
                      {category.subcategories.map((sub) => (
                        <li
                          key={sub.id}>
                          <Link to={`/products/${category.action_url}/${sub.action_url}`} onClick={toggleDrawer}>{sub.name}</Link>
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
      {/* ✅ Floating WhatsApp Icon */}
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
