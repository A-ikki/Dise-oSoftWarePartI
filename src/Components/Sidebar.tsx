// src/components/Sidebar.tsx
import React from 'react';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="close-btn" onClick={onClose}>×</div>
      <nav>
        <ul>
          <li>Inicio</li>
          <li>Ligas</li>
          <li>Hoy</li>
          <li>Sign In</li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
