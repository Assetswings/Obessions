import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import TopAnnouncementBar from "../components/Navbars/TopAnnouncementBar";
import Topnav from "../components/Navbars/Topnav";
import OtherTopnav from "../components/Navbars/OtherTopnav";
import MobileNav from "../components/Navbars/MobileNav";
import BottomTab from "../components/Mobiletab/BottomTab";

const MainLayout = () => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Top Navbar Logic */}
      {isMobile ? (
        <MobileNav />
      ) : (
        <>
          {isHome && <TopAnnouncementBar />}
          {isHome ? <Topnav /> : <OtherTopnav />}
        </>
      )}

      {/* Page content */}
      <Outlet />

      {/* 👇 Sticky bottom tab only for mobile */}
      {isMobile && <BottomTab />}
    </>
  );
};

export default MainLayout;
