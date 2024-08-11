// src/components/Sidebar.tsx
import React, { useState } from 'react';

import './Sidebar.css';
import LeaguesCarousel from '../Pages/LeaguesCarousel';


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [activeView, setActiveView] = useState('home'); // 'home' será la vista predeterminada

  const handleNavClick = (view) => {
    setActiveView(view); // Cambia la vista activa cuando se hace clic en una opción de la barra de navegación
  };
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="close-btn" onClick={onClose}>×</div>
      <nav>
        <ul>
          <li>Inicio</li>
          <li onClick={() => handleNavClick('home')}>Home</li>
          <li onClick={() => handleNavClick(LeaguesCarousel)}>Ligas</li>

  
          <li>Hoy</li>
          <li>Buscar</li>
          <li>Sign In</li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
