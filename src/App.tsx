// src/App.tsx
import React, { useState } from 'react';
import './App.css';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app">
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <button className="toggle-button" onClick={toggleSidebar}>
          {isSidebarOpen ? '←' : '→'}
        </button>
        <ul>
          <li>Barra Vertical</li>
          <li>Navegación</li>
          <li>Ligas</li>
          <li>Juegos de Hoy</li>
          <li>Search</li>
          <li>Sign In</li>
        </ul>
      </div>
      <div className="content">
        <div className="header">
          <h1>Juegos Destacados</h1>
        </div>
        <div className="news-section">
          <h2>News</h2>
          {/* Aquí va el contenido de las noticias */}
        </div>
        {/* Añadir más secciones según sea necesario */}
      </div>
    </div>
  );
};

export default App;
