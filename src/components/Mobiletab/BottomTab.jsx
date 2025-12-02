import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation, Link } from "react-router-dom";
import { Home, LayoutGrid, ShoppingCart, Heart, X } from "lucide-react";
import "./BottomTab.css";
import { ReactComponent as HomeIcon } from "../../assets/icons/homeicon.svg";
import WishlistModal from "../Wishtlist/WishlistModal";
import { useCartWishlist } from "../../app/CartWishlistContext";

const categories = [
  { name: "Bath Care", img: "https://i.ibb.co/9Rk33kn/image-648.png" },
  { name: "Dustbins", img: "https://i.ibb.co/R8R9Ndp/image-649.png" },
  { name: "Floor Coverings", img: "https://i.ibb.co/ZRzVmFrL/image-650.png" },
  { name: "Kitchen & Dining", img: "https://i.ibb.co/3yvJ8sTw/image-651.png" },
  { name: "Storage & Organization", img: "https://i.ibb.co/4gTM7FLd/image-653.png" },
  { name: "Tableware & Serve ware", img: "https://i.ibb.co/sp96bfBX/image-652.png" },
];

const BottomTab = () => {
  const [showCategories, setShowCategories] = useState(false);
  const [showwishlist, setShowwishlist] = useState(false);
  const [mergedCategories, setmergedCategories] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { countData } = useCartWishlist();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    setShowCategories(false);
    // get data from localStorage
    const hero_banner_categories = JSON.parse(localStorage.getItem('hero_banner_categories') || '[]');
    setmergedCategories(hero_banner_categories);
  }, [location.pathname]);

  const handleWishlistClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      setShowwishlist(true);
    } else {
      navigate("/login");
    }
  };
  return (
    <>
      <div className="bottom-tab">
        <NavLink to="/" end className={({ isActive }) => `tab-item ${isActive ? "active" : ""}`}>
          <HomeIcon className="tab-icon" />
          <span>Home</span>
        </NavLink>

        <div
          className={`tab-item ${showCategories ? "active-tab" : ""}`}
          onClick={() => setShowCategories(!showCategories)}
        >
          <LayoutGrid
            size={22}
            color={showCategories ? "#000" : "#999"}
            fill={showCategories ? "#000" : "none"}
          />
          <span className={showCategories ? "active" : ""}>Categories</span>
        </div>
        {/* {countData?.cart_count ?? ''} */}
        <NavLink to="/cart" className="tab-item cart-tab">
          {({ isActive }) => (
            <div className="icon-wrapper cart-icon-wrapper">
              <ShoppingCart
                size={22}
                color={isActive ? "#000" : "#999"}
                fill={isActive ? "#000" : "none"}
              />
              {countData?.cart_count > 0 && (
                <span className="cart-badge_mlb">{countData.cart_count}</span>
              )}
              <span className={isActive ? "active" : ""}>Cart</span>
            </div>
          )}
        </NavLink>

        {/* WISHLIST ICON WITH BADGE */}
        <div
          className={`tab-item wishlist-tab ${showwishlist ? "active-tab" : ""}`}
          onClick={() => handleWishlistClick()}
        >
          <div className="icon-wrapper wishlist-icon-wrapper">
            <Heart
              size={22}
              color={showwishlist ? "#000" : "#999"}
              fill={showwishlist ? "#000" : "none"}
            />
            {countData?.wishlist_count > 0 && (
              <span className="wishlist-badge_mlb">{countData.wishlist_count}</span>
            )}
            <span className={showwishlist ? "active" : ""}>Wishlist</span>
          </div>
        </div>
      </div>
      {showwishlist && <WishlistModal onClose={() => setShowwishlist(false)} />}
      <div className={`category-drawer ${showCategories ? "open" : ""}`}>
        <div className="drawer-header_btm">
          <h3>Categories</h3>
          <button className="close-btn-nav" onClick={() => setShowCategories(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="category-list_mlb">
          {mergedCategories.map((cat, index) => (
            <div
              key={index}
              className="category-item"
            >
              <Link to={`/products/${cat.action_url}`}>
                <img src={cat.media} alt={cat.name} />
                <span>{cat.name}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BottomTab;
