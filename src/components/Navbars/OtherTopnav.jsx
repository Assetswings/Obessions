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
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
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
import { IoLogoWhatsapp } from "react-icons/io";
import API from "../../app/api";
import { useCartWishlist } from "../../app/CartWishlistContext";

const OtherTopnav = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { countData } = useCartWishlist();
  const { getCartWishlistCount } = useCartWishlist();
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const navigate = useNavigate();
  const userWrapperRef = useRef(null);
  const inputRef = useRef(null);
  const searchState = useSelector((state) => state.search || {});
  const { results = [], loading, error } = searchState;
  const [data, setData] = useState("");

  const currentPath = location.pathname;
  const hideIconPaths = ["/searchlist"];
  const shouldHideIcon = hideIconPaths.includes(currentPath);
  useEffect(() => {
    chatsupport();
  }, []);
  useEffect(() => {
    setShowSearch(false);
    setQuery("");
  }, [location]);
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

  const checkSession = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }
  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (results.length > 0) {
      setSearchResult(results);
    }
  }, [results]);

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
  const handleCartClick = (e) => {
    const token = localStorage.getItem("token");

    if (!token) {
      e.preventDefault(); // Stop <Link> navigation
      // Show your login modal or redirect
      setShowLoginPrompt(true);
    }
  };

  const handleWishlistClick = () => {
    checkSession();
    if (isLoggedIn) {
      setShowWishlist(true);
    } else {
      setShowLoginPrompt(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    setShowUserPopup(false);
    // toast.success("Logout Successfully.", {
    //   style: {
    //     border: "1px solid #713200",
    //     padding: "16px",
    //     color: "#713200",
    //   },
    //   iconTheme: {
    //     primary: "#713200",
    //     secondary: "#FFFAEE",
    //   },
    //   hideProgressBar: true,
    //   closeButton: true,
    //   icon: true,
    // });
    getCartWishlistCount();
    navigate("/");
  };

  const handleProfile = () => {
    setShowUserPopup(false);
    navigate("/ProfilePage");
  };

  const handleUserClick = () => {
    checkSession();
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
    // dispatch(clearSearchResults());
    setQuery("");
    setSearchResult([]);
  };

  let closeTimer;
  const handleMouseEnter = () => {
    clearTimeout(closeTimer);
    setShowMegaMenu(true);
  };
  const handleMouseLeave = () => {
    closeTimer = setTimeout(() => setShowMegaMenu(false), 200); // small delay for smoother UX
  };

  return (
    <>
      {/* <ToastContainer style={{ zIndex: 9999999999999 }} position="top-right" autoClose={3000} /> */}
      <nav className="other-topnav">

        <div
          className="nav-logo"
          style={{ cursor: "pointer" }}>
          <Link to='/'>
            <img src={localStorage.getItem('logo')} alt="Obsession" />
          </Link>
        </div>


        <ul className="nav-links">
          {/* <li onMouseEnter={() => setShowMegaMenu(true)}>SHOP</li> */}
          {/* <li >
            <div
             className="root_base"
              
              >
                 <div  className="track_poster" > 
                   <span > SHOP</span>
     
                 </div>
           
            </div>
            {showMegaMenu && (
              <div
                className="megamenu-wrapper"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  zIndex: 1000,
                  background: "#fff",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}>
                <MegamenuDuo closeMenu={() => setShowMegaMenu(false)} />
              </div>
            )}
          </li> */}

          <li
            className="shop-wrapper"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="track_poster">
              <span>SHOP</span>
            </div>

            <div
              className={`megamenu-wrapper ${showMegaMenu ? "visible" : ""}`}
            >
              <MegamenuDuo closeMenu={() => setShowMegaMenu(false)} />
            </div>
          </li>
          <li>
            <NavLink to="/new-arrivals" className={({ isActive }) => (isActive ? "active-tab" : "")}>
              <div className="track_poster">
                NEW ARRIVALS
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink to='/bestseller' className={({ isActive }) => (isActive ? "active-tab" : "")}>
              <div className="track_poster"> BEST SELLERS </div>

            </NavLink>
          </li>
          <li>
            <NavLink to='/offer-spot' className={({ isActive }) => (isActive ? "active-tab" : "")}>
              <div className="track_poster">  OFFERS SPOT</div>

            </NavLink>
          </li>
          <li>
            <NavLink to='/carpet-finder' className={({ isActive }) => (isActive ? "active-tab" : "")}>
              <div className="track_poster">
                FLOOR MATCHER
              </div>
            </NavLink>
          </li>
        </ul>

        <div className="nav-actions">
          {!shouldHideIcon && (
            <div className="search-bar">
              <button onClick={() => setShowSearch(true)}>
                <FaSearch />
              </button>
            </div>
          )}

          {/* User Icon */}
          <div
            ref={userWrapperRef}
            className="user-click-wrapper"
            onClick={handleUserClick}
            style={{ position: "relative" }}
            title="User Profile"
          >
            <span style={{ fontSize: "12px", paddingRight: "7px" }}>{localStorage.getItem('userName') ?? ''}</span>
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
                  <div className="popup-item">
                    <Link to='/ProfilePage'>
                      <User size={22} style={{ marginRight: 8 }} />
                      <span>Profile</span>
                    </Link>
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
          <div title="Wish List">
            <Heart
              strokeWidth={1}
              size={25}
              title="Wish List"
              onClick={handleWishlistClick}
              style={{ cursor: "pointer" }}
            />
            <span className="wishlist-badge" style={{ right: "65px", top: "10px" }}>{countData?.wishlist_count ?? ''}</span>
          </div>
          <div title="Cart">
            <Link to="/cart" onClick={handleCartClick}>
              <ShoppingCart
                onClick={handleCartClick}
                strokeWidth={1}
                title="Shopping Cart"
                size={25}
                style={{ cursor: "pointer" }}
              />
              <span className="wishlist-badge" style={{ right: "22px", top: "10px" }}>{countData?.cart_count ?? ''}</span>
            </Link>
          </div>
        </div>
      </nav>

      <div style={{ height: "50px" }}></div>
      {/* <div style={{height:"60px"}}></div> */}

      {/* {showMegaMenu && (
        <div className="megamenu-wrapper">
          <MegamenuDuo closeMenu={() => setShowMegaMenu(false)} />
        </div>
      )} */}

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
                  navigate("/searchlist", {
                    state: { query: query },
                  });
                }}
              >
                <Search strokeWidth={1.25} />
              </button>
            </div>

            {Array.isArray(searchResult) && (
              <>
                {searchResult.length > 0 ? (
                  <div className="search-results-grid-other">
                    {searchResult.slice(0, 8).map((item, index) => (
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
      {/* ✅ Floating WhatsApp Icon */}
      <a
        href={`https://api.whatsapp.com/send?phone=${data?.phone}&text=${data?.text}`}
        className="floating-whatsapp"
        target="_blank"
        rel="noopener noreferrer"
      >
        <IoLogoWhatsapp className="whatsapp-icon" />
      </a>
    </>
  );
};

export default OtherTopnav;
