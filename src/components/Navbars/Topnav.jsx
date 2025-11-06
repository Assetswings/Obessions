import React, { useEffect, useState } from "react";
import "./HorizontalNavBar.css";
import MegaMenu from "./MegaMenu";
import { Link, useNavigate } from "react-router-dom";
import { IoLogoWhatsapp } from "react-icons/io";
import API from "../../app/api";

const Topnav = () => {
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [data, setData] = useState("");
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
      <nav className="horizontal-nav-bar">
        {/* <div
          className="nav-item"
          onMouseEnter={() => setShowMegaMenu(true)}
        >
          SHOP
        </div> */}
        {/* <div
          className="nav-item"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ position: "relative" }}>
          SHOP
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
              }}
            >
            <MegaMenu closeMenu={() => setShowMegaMenu(false)} />
            </div>
          )}
        </div> */}
        <div
          className="nav-item shop-wrapper"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ position: "relative" }}
        >
          <div className="track_poster">
            <span>SHOP</span>
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
                borderTop: "1px solid #eee",
              }}
            >
              <MegaMenu closeMenu={() => setShowMegaMenu(false)}/>
            </div>
          )}
        </div>


        <div className="nav-item">
          <Link to='/new-arrivals'>NEW ARRIVALS</Link>
        </div>
        <div className="nav-item">
          <Link to='/bestseller'>BEST SELLERS</Link>
        </div>
        <div className="nav-item">
          <Link to='/offer-spot'>OFFERS SPOT</Link>
        </div>
        <div className="nav-item">
          <Link to='/carpet-finder'>FLOOR MATCHER</Link>
        </div>
      </nav>
      {/* {showMegaMenu && <MegaMenu closeMenu={() => setShowMegaMenu(false)} />} */}
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

export default Topnav;
