import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Home, LayoutGrid, ShoppingCart, Heart, X } from "lucide-react";
import "./BottomTab.css";

 const categories = [
    { name: "Bath Care" },
    { name: "Dustbins"},
    { name: "Floor Coverings" },
    { name: "Kitchen & Dining"},
    { name: "Storage & Organization" },
    { name: "Tableware & Serve ware"},
  ];

const BottomTab = () => {
  const [showCategories, setShowCategories] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  
  useEffect(() => {
    setShowCategories(false);
  }, [location.pathname]);

  return (
    <>
      <div className="bottom-tab">
        <NavLink to="/" end className="tab-item">
          {({ isActive }) => (
            <>
              <Home
                size={22}
                color={isActive ? "#000" : "#999"}
                fill={isActive ? "#000" : "none"}
              />
              <span className={isActive ? "active" : ""}>Home</span>
            </>
          )}
        </NavLink>

        <div
          className={`tab-item ${showCategories ? "active-tab" : ""}`}
          onClick={() => setShowCategories(true)}
        >
          <LayoutGrid
            size={22}
            color={showCategories ? "#000" : "#999"}
            fill={showCategories ? "#000" : "none"}
          />
          <span className={showCategories ? "active" : ""}>Categories</span>
        </div>

        <NavLink to="/cart" className="tab-item">
          {({ isActive }) => (
            <>
              <ShoppingCart
                size={22}
                color={isActive ? "#000" : "#999"}
                fill={isActive ? "#000" : "none"}
              />
              <span className={isActive ? "active" : ""}>Cart</span>
            </>
          )}
        </NavLink>

        <NavLink to="/wishlist" className="tab-item">
          {({ isActive }) => (
            <>
              <Heart
                size={22}
                color={isActive ? "#000" : "#999"}
                fill={isActive ? "#000" : "none"}
              />
              <span className={isActive ? "active" : ""}>Wishlist</span>
            </>
          )}
        </NavLink>
      </div>

      <div className={`category-drawer ${showCategories ? "open" : ""}`}>
        <div className="drawer-header">
          <h3>Categories</h3>
          <button className="close-btn" onClick={() => setShowCategories(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="category-list">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="category-item"
              onClick={() => {
                setShowCategories(false);
                navigate("/collections");
              }}
            >
              <span>{cat?.name}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BottomTab;
