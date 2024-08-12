// src/components/Header.tsx
import React, { useEffect, useState } from 'react';
import './header.css';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const headerFavs = document.querySelector('.header-favs') as HTMLElement;
      if (headerFavs && headerFavs.offsetWidth < 300) { // Ajusta el valor según tus necesidades
        setIsMenuVisible(true);
      } else {
        setIsMenuVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check on initial load

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuClick = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <header className="header">
      <div className="header-logo">SOCCER</div>
      <div className="header-right">
        <div className={`header-favs ${isSidebarVisible ? 'sidebar-visible' : ''}`}>
          <span>★</span> MY FAVS
          <ul>
            <li>Inicio</li>
            <li>Hoy</li>
            <li>Buscar</li>
            <li>Sign In</li>
          </ul>
        </div>
        {isMenuVisible && (
          <div className="header-menu" onClick={handleMenuClick}>
            <div className="menu-icon"></div>
            <div className="menu-icon"></div>
            <div className="menu-icon"></div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
