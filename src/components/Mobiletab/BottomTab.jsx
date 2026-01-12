import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { LayoutGrid, ShoppingCart, Heart, X } from "lucide-react";
import "./BottomTab.css";
import { ReactComponent as HomeIcon } from "../../assets/icons/homeicon.svg";
import WishlistModal from "../Wishtlist/WishlistModal";
import { useCartWishlist } from "../../app/CartWishlistContext";
import { useSelector, useDispatch } from "react-redux";
import { fetchHomeData } from "../../pages/Home/homeSlice";

    
const BottomTab = () => {
  const [showCategories, setShowCategories] = useState(false);
  const [showwishlist, setShowwishlist] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { countData } = useCartWishlist();

  const homeData = useSelector((state) => state.home.data);
  const categories = homeData?.hero_banner_categories || [];

  // 🔥 ENSURE HOME DATA EXISTS (GLOBAL SAFETY)
  useEffect(() => {
    dispatch(fetchHomeData());
  }, [dispatch]);

  const handleWishlistClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    setShowwishlist(true);
  };

  return (
    <>
      {/* BOTTOM NAV */}
      <div className="bottom-tab">
        <NavLink to="/" end className={({ isActive }) => `tab-item ${isActive ? "active" : ""}`}>
          <HomeIcon className="tab-icon" />
          <span>Home</span>
        </NavLink>

        {/* CATEGORIES */}
        <div
          className={`tab-item ${showCategories ? "active-tab" : ""}`}
          onClick={() => setShowCategories((p) => !p)}
        >
          <LayoutGrid
            size={22}
            color={showCategories ? "#000" : "#999"}
            fill={showCategories ? "#000" : "none"}
          />
          <span className={showCategories ? "active" : ""}>Categories</span>
        </div>

        {/* CART */}
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

        {/* WISHLIST */}
        <div className="tab-item wishlist-tab" onClick={handleWishlistClick}>
          <div className="icon-wrapper wishlist-icon-wrapper">
            <Heart size={22} color="#999" />
            {countData?.wishlist_count > 0 && (
              <span className="wishlist-badge_mlb">
                {countData.wishlist_count}
              </span>
            )}
            <span>Wishlist</span>
          </div>
        </div>
      </div>

      {showwishlist && <WishlistModal onClose={() => setShowwishlist(false)} />}

      {/* CATEGORY DRAWER */}
      <div className={`category-drawer ${showCategories ? "open" : ""}`}>
        <div className="drawer-header_btm">
          <h3>Categories</h3>
          <button className="close-btn-nav" onClick={() => setShowCategories(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="category-list_mlb">
          {categories.length > 0 ? (
            categories.map((cat, index) => (
              <Link
                key={index}
                to={`/products/${cat.action_url}`}
                onClick={() => setShowCategories(false)}
              >
                <div className="category-item">
                  <img src={cat.media} alt={cat.name} />
                  <span>{cat.name}</span>
                </div>
              </Link>
            ))
          ) : (
            <p className="empty-text">Loading categories…</p>
          )}
        </div>
      </div>
    </>
  );
};

export default BottomTab;
