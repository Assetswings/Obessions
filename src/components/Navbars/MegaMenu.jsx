import React, { useEffect, useState } from "react";
import "./Megamenu.css";
import { IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { fetchMegamenuData } from "./megamenuSlice";
import { useNavigate } from "react-router-dom";

  const MegaMenu = ({ closeMenu }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, loading, error } = useSelector((state) => state.megamenu);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  const menuList = Array.isArray(data) ? data : [];
  const activeSection = menuList[activeSectionIndex];

    useEffect(() => {
    dispatch(fetchMegamenuData());
  },[dispatch]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

     const handleSubcategoryClick = (categorySlug, subcategorySlug) => {
    console.log("two slugs---->", categorySlug, subcategorySlug);
    navigate("/products", {
      state: {
        category: categorySlug,
        subcategory: subcategorySlug,
      },
    });
    closeMenu(); 
  };

  const handleCategoryClick = (categorySlug) => {
    navigate("/products", {
      state: {
        category: categorySlug,
      },
    });
    closeMenu(); // Close the mega menu
  };

  if (loading || menuList.length === 0) {
    return <div className="mega-modal"></div>;
  }

  if (error) {
    return <div className="mega-modal">Error: {error}</div>;
  }

  return (
    <div className="mega-modal">
      <div className="mega-backdrop" onClick={closeMenu}></div>
      <div className="mega-menu-content">
        {/* LEFT: Main Categories */}
        <div className="mega-menu-left">
          <ul className="menu-categories">
            {menuList.map((section, index) => (
              <li
                key={section.id}
                className={index === activeSectionIndex ? "active" : ""}
                onClick={() => setActiveSectionIndex(index)}
              >
                <span>{section.name}</span>
                <span className="icon_arrow_section">
                  <IoIosArrowForward />
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* CENTER: Subcategories */}
        <div className="mega-menu-center">
          {activeSection?.categories?.map((cat) => (
            <div className="menu-section" key={cat.id}>
              <h4
                className="category-header"
                onClick={() => handleCategoryClick(cat.action_url)}
              >
                {cat.name}
              </h4>
              <ul>
                {cat.subcategories.map((sub) => (
                  <li
                    key={sub.id}
                    onClick={() =>
                      handleSubcategoryClick(cat.action_url, sub.action_url)
                    }
                    className="mega-subcategory-link"
                  >
                    {sub.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* RIGHT: Image */}
        <div className="mega-menu-right">
          <img src={activeSection.media} alt={activeSection.name} />
        </div>

        {/* Close Button */}
        <button className="close-btn" onClick={closeMenu}>
          ×
        </button>
      </div>
    </div>
  );
};

export default MegaMenu;
