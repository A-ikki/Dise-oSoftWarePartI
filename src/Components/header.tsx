// src/components/Header.tsx
import React from 'react';
import './header.css';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="header">
      <div className="header-logo">SOCCER</div>
      <div className="header-right">
        <div className="header-favs">
          <span>★</span> MY FAVS
        </div>
        <div className="header-menu" onClick={onMenuClick}>
          <div className="menu-icon"></div>
          <div className="menu-icon"></div>
          <div className="menu-icon"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
