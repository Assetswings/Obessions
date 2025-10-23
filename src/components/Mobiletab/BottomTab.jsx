import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Grid,LayoutGrid, ShoppingCart, Heart } from "lucide-react";
import "./BottomTab.css";

const BottomTab = () => {
  return (
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

      <NavLink to="/collections" className="tab-item">
        {({ isActive }) => (
          <>
            < LayoutGrid
              size={22}
              color={isActive ? "#000" : "#999"}
              fill={isActive ? "#000" : "none"}
            />


            <span className={isActive ? "active" : ""}>Categories</span>
          </>
        )}
      </NavLink>

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
  );
};

export default BottomTab;
