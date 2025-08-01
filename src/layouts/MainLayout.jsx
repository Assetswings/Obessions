import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TopAnnouncementBar from '../components/Navbars/TopAnnouncementBar';
import Topnav from '../components/Navbars/Topnav';
import OtherTopnav from '../components/Navbars/OtherTopnav';
import MobileNav from '../components/Navbars/MobileNav';

const MainLayout = () => {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

    return (
    <>
      {isMobile ? (
        <MobileNav />
      ) : (
        <>
          {isHome && <TopAnnouncementBar />}
          {isHome ? <Topnav /> : <OtherTopnav />}
        </>
      )}
      <Outlet />
    </>
  );
};

export default MainLayout;
