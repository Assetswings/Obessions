import React from 'react';
import { Outlet } from 'react-router-dom';
import TopAnnouncementBar from '../components/Navbars/TopAnnouncementBar';
import Topnav from '../components/Navbars/Topnav';
import MobileNav from '../components/Navbars/MobileNav';

const HomeLayout = () => {
  const isMobile = window.innerWidth <= 768;

  return (
    <>
      <TopAnnouncementBar />
      {isMobile ? <MobileNav /> : <Topnav />}
      <Outlet />
    </>
  );
};

export default HomeLayout;
