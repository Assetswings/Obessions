import React from 'react';
import { Outlet } from 'react-router-dom';
import TopAnnouncementBar from '../components/Navbars/TopAnnouncementBar';
import OtherTopnav from '../components/Navbars/OtherTopnav';
import MobileNav from '../components/Navbars/MobileNav';

const DefaultLayout = () => {
  const isMobile = window.innerWidth <= 768;

  return (
    <>
      {isMobile ? <MobileNav /> : <OtherTopnav />}
      <Outlet />
    </>
  );
};

export default DefaultLayout;