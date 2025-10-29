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
  return (
    <>
      <nav className="horizontal-nav-bar">
        <div
          className="nav-item"
          onMouseEnter={() => setShowMegaMenu(true)}
        >
          SHOP
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
      {showMegaMenu && <MegaMenu closeMenu={() => setShowMegaMenu(false)} />}
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
