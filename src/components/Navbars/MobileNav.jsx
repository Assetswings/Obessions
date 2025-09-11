import React, { useState, useEffect } from "react";
import "./MobileNav.css";
import {
  Heart,
  CircleUser,
  ShoppingCart,
  ChevronRight,
  ChevronLeft,
  Plus,
} from "lucide-react";
import mobilelogo from "../../assets/images/Logomobile.png";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("main");
  const [prevMenu, setPrevMenu] = useState(null);
  const [direction, setDirection] = useState("forward"); // forward | back

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
    setActiveMenu("main");
    setPrevMenu(null);
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
      setPrevMenu("category");
      setActiveMenu("shop");
    } else if (activeMenu === "shop") {
      setPrevMenu("shop");
      setActiveMenu("main");
    }
  };

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

  return (
    <>
      {/* Top bar */}
      <header className="topbar">
        <div className="hamburger" onClick={toggleDrawer}>
          <span></span>
          <span></span>
        </div>
        <div className="mobile_logo_track">
          <img src={mobilelogo} width={120} alt="logo" />
        </div>

        <div className="icons">
          <CircleUser
            strokeWidth={1}
            color="#FFFFFF"
            size={25}
            style={{ cursor: "pointer" }}
          />
          <Heart strokeWidth={1} size={25} style={{ cursor: "pointer" }} />
          <ShoppingCart
            strokeWidth={1}
            size={25}
            style={{ cursor: "pointer" }}
          />
        </div>
      </header>

      {/* Drawer */}
      <div className={`drawer ${isOpen ? "open" : ""}`}>
        <div className="drawer-header">
          {activeMenu !== "main" && (
            <span className="back-btn" onClick={goBack}>
              <ChevronLeft />
            </span>
          )}
          <span onClick={toggleDrawer} className="close-btn">
            ✕
          </span>
        </div>

        <div className="menu-container">
          {/* Main Menu */}
          <div
            className={`menu ${activeMenu === "main" ? "active" : ""} ${
              prevMenu === "main"
                ? direction === "forward"
                  ? "slide-left"
                  : "slide-right"
                : ""
            }`}
          >
            <ul>
              <li onClick={() => navigateTo("shop")}>
                <div className="iteam_main">
                  <div> Shop </div>
                  <div>
                    <ChevronRight />
                  </div>
                </div>
              </li>
              <li>New Arrivals</li>
              <li>Best Sellers</li>
              <li>Offers Spot</li>
              <li>Floor Matcher</li>
            </ul>
            <ul>
              <li>Wishlist</li>
              <li>Cart</li>
              <li>Account</li>
            </ul>
          </div>

          {/* Shop Menu */}
          <div
            className={`menu ${activeMenu === "shop" ? "active" : ""} ${
              prevMenu === "shop"
                ? direction === "forward"
                  ? "slide-left"
                  : "slide-right"
                : ""
            }`}
          >
            <ul>
              <li onClick={() => navigateTo("category")}>
                <div className="iteam_main">
                  <div> Category</div>
                  <div>
                    <ChevronRight />
                  </div>
                </div>
              </li>
              <li>
                <div className="iteam_main">
                  <div>Room </div>
                  <div>
                    <ChevronRight />
                  </div>
                </div>
              </li>
              <li>
                <div className="iteam_main">
                  <div>Lifestyle </div>
                  <div>
                    <ChevronRight />
                  </div>
                </div>
              </li>
              <li>
                <div className="iteam_main">
                  <div>Utility</div>
                  <div>
                    <ChevronRight />
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Category Menu */}
          <div
            className={`menu ${activeMenu === "category" ? "active" : ""} ${
              prevMenu === "category"
                ? direction === "forward"
                  ? "slide-left"
                  : "slide-right"
                : ""
            }`}>
            <ul>
              <li>
              <div className="iteam_main">
                  <div> Tableware</div> 
                  <div><Plus /></div> 
                  </div>
                  </li>
              <li>
              <div className="iteam_main">
                  <div>Kitchen</div> 
                  <div><Plus /></div> 
                  </div>
                 </li>
              <li>
              <div className="iteam_main">
                  <div> Bath Care</div> 
                  <div><Plus /></div> 
                  </div>
                 </li>
              <li>
                  <div className="iteam_main">
                  <div>  Yoga </div> 
                  <div><Plus /></div> 
                  </div>
               </li>
              <li>
              <div className="iteam_main">
                  <div>  Dustbin </div> 
                  <div><Plus /></div> 
                  </div>
                 </li>
              <li>
              <div className="iteam_main">
                  <div>Floor Covering</div> 
                  <div><Plus /></div> 
                  </div>
                 </li>
              <li>
              <div className="iteam_main">
                  <div>ORGANISER</div> 
                  <div><Plus /></div> 
                  </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {isOpen && <div className="overlay" onClick={toggleDrawer}></div>}
    </>
  );
};

export default MobileNav;
