import React, { useEffect, useState } from 'react';
import MobileNavbar from './MobileNavbar';
import Navbar from './Navbar';

function ShowNav() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 868);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 868);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile ? <MobileNavbar /> : <Navbar />;
}

export default ShowNav;
