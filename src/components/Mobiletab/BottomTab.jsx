import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation, Link } from "react-router-dom";
import { Home, LayoutGrid, ShoppingCart, Heart, X } from "lucide-react";
import "./BottomTab.css";
import { ReactComponent as HomeIcon } from "../../assets/icons/homeicon.svg";

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
  const [mergedCategories, setmergedCategories] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    setShowCategories(false);
    // get data from localStorage
    const hero_banner_categories = JSON.parse(localStorage.getItem('hero_banner_categories') || '[]');
    // map and append image
    const mergedCategoriesdata = hero_banner_categories.map((item) => {
      // try to find a matching category by name (case-insensitive & partial match)
      const matched = categories.find(cat =>
        cat.name.toLowerCase().includes(item.name.toLowerCase()) ||
        item.name.toLowerCase().includes(cat.name.toLowerCase())
      );
      return {
        ...item,
        img: matched ? matched.img : null, // add image if found, else null
      };
    });
    setmergedCategories(mergedCategoriesdata);
    console.log(mergedCategoriesdata);

  }, [location.pathname]);

  return (
    <>
      <div className="bottom-tab">
        <NavLink to="/" end className="tab-item">
          {({ isActive }) => (
            <>
              {/* <Home
                size={22}
                color={isActive ? "#000" : "#999"}
                fill={isActive ? "#000" : "none"}
              /> */}
              <HomeIcon
                width={25}
                height={25}
                fill={isActive ? "#000" : "none"} // change fill dynamically
                // stroke={isActive ? "#000" : "#000"} // optional stroke
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

        <div className="category-list_mlb">
          {mergedCategories.map((cat, index) => (
            <div
              key={index}
              className="category-item"
            >
              <Link to={`/products/${cat.action_url}`}>
                <img src={cat.img} alt={cat.name} />
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
