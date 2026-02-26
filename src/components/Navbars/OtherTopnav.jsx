import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  CircleUser,
  ShoppingCart,
  User,
  LogOut,
  Search,
} from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import MegamenuDuo from "./MegamenuDuo";
import WishlistModal from "../Wishtlist/WishlistModal";
import "./OtherTopnav.css";
import LoginPromptModal from "../LoginModal/LoginPromptModal";
import { useDispatch, useSelector } from "react-redux";
import { IoLogoWhatsapp } from "react-icons/io";
import API from "../../app/api";
import { useCartWishlist } from "../../app/CartWishlistContext";
import searchicon from "../../assets/icons/Searchicon.svg";

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
  const [disableHover, setDisableHover] = useState(false);
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const navigate = useNavigate();
  const userWrapperRef = useRef(null);
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState("");
  const isLoginPage = location.pathname === "/login";


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
  const handleCartClick = (e) => {
    const token = localStorage.getItem("token");

    if (!token) {
      e.preventDefault(); // Stop <Link> navigation
      // Show your login modal or redirect
      setShowLoginPrompt(true);
    }
  };

  const handleWishlistClick = () => {
    let logintoken = localStorage.getItem("token");
    if (logintoken) {
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
    //     borderRadius:"inherit",
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

  // const handleUserClick = () => {
  //   checkSession();
  //   if (!isLoggedIn) {
  //     navigate("/login");
  //   } else {
  //     setShowUserPopup((prev) => !prev);
  //   }
  // };

  const handleUserClick = (e) => {
    e.stopPropagation();
    let logintoken = localStorage.getItem("token");
    if (!logintoken) {
      console.log('not logedin');
      navigate("/login");
    } else {
      console.log('logedin');
      setShowUserPopup(true);
    }
  };

  const claersearch = () => {
    setShowSearch(false);
    // dispatch(clearSearchResults());
    setQuery("");
    setSearchData([]);
  };

  const closeTimer = useRef(null);
  const handleMouseEnter = () => {
    if (disableHover) return; // ❌ prevent reopening while disabled
    clearTimeout(closeTimer.current);
    setShowMegaMenu(true);
  };

  const handleMouseLeave = () => {
    if (disableHover) return; // ❌ prevent closing while disabled
    closeTimer.current = setTimeout(() => {
      setShowMegaMenu(false);
    }, 200);
  };

  const handleItemClick = () => {
    clearTimeout(closeTimer.current);
    setDisableHover(true);
    setShowMegaMenu(false);

    // re-enable hover after a short delay
    setTimeout(() => setDisableHover(false), 200);
  };


  //   useEffect(() => {
  //    if (showMegaMenu) {
  //      document.body.style.overflow = "hidden";
  //    } else {
  //      document.body.style.overflow = "auto";
  //    }

  //    return () => {
  //      document.body.style.overflow = "auto";
  //    };
  //  }, [showMegaMenu]);


  return (
    <>
      {/* <ToastContainer style={{ zIndex: 9999999999999 }} position="top-right" autoClose={3000} /> */}
      <nav className="other-topnav">
        <div
          className="nav-logo"
          style={{ cursor: "pointer" }}>
          <Link to='/'>
            <img src="https://efi-s3-private.s3.ap-south-1.amazonaws.com/b2c-img/EnvogueImages/ReactJs_App/assets/logo-white.png" alt="Obsession" />
          </Link>
        </div>
        <ul className="nav-links">
          <li
            className="shop-wrapper"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>

            <div className="track_poster">
              <span>SHOP</span>
            </div>

            <div className={`megamenu-wrapper ${showMegaMenu ? "visible" : ""}`}>
              <MegamenuDuo closeMenu={handleItemClick} />
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
            <NavLink to='/bestsellers' className={({ isActive }) => (isActive ? "active-tab" : "")}>
              <div className="track_poster"> BESTSELLERS </div>

            </NavLink>
          </li>
          <li>
            <NavLink to='/offer-spot' className={({ isActive }) => (isActive ? "active-tab" : "")}>
              <div className="track_poster">  OFFERS SPOTS</div>

            </NavLink>
          </li>
          <li>
            <NavLink to='/floor-matcher' className={({ isActive }) => (isActive ? "active-tab" : "")}>
              <div className="track_poster">
                FLOOR MATCHER
              </div>
            </NavLink>
          </li>
        </ul>

        <div className="nav-actions">
          {/* {location.pathname !== "/login" && (
            <img
              src={searchicon}
              alt="search"
              onClick={() => setShowSearch(true)}
              className="pointer-crusser"
            />
          )} */}
          <img src={searchicon} alt="search" onClick={() => setShowSearch(true)} className="pointer-crusser" />
          {/* User Icon */}
          <div
            ref={userWrapperRef}
            className="user-click-wrapper"
            style={{ position: "relative", left: '7px', top: '0px' }}

          >
            <span style={{ fontSize: "12px", paddingRight: "7px" }}>{localStorage.getItem('userName') ?? ''}</span>
            <span title="User Profile">
              <CircleUser
                strokeWidth={1}
                color="#FFFFFF"
                size={25}
                style={{ cursor: "pointer" }}
                onClick={handleUserClick}
              />
            </span>
            {showUserPopup && (
              <>
                <div className="popup-triangle"></div>
                <div className="user-popup">
                  <div className="popup-item">
                    <Link to='/ProfilePage'>
                      <User size={22} style={{ marginRight: 8 }} />
                      <span title="Profile" >Profile</span>
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
                    <span title="Logout">Logout</span>
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
            <span className="wishlist-badge" style={{ right: "68px", top: "10px", color: "black" }}>
              <span style={{ position: 'relative', top: '1px' }}> {countData?.wishlist_count ?? ''}</span>
            </span>
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
              <span className="wishlist-badge" style={{ right: "27px", top: "10px", color: "black" }}>
                <span style={{ position: 'relative', top: '1px' }}>{countData?.cart_count ?? ''} </span>
              </span>
            </Link>
          </div>
        </div>
      </nav>
      <div style={{ height: "50px" }}></div>
      {showWishlist && <WishlistModal onClose={() => setShowWishlist(false)} />}
      {showLoginPrompt && location.pathname !== "/login" && (
        <LoginPromptModal onClose={() => setShowLoginPrompt(false)} />
      )}

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
                    navigate(`/searchlist?query=${encodeURIComponent(query)}`);
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
