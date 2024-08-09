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
      <aside className="sidebar">
        <nav>
          <ul>
            <li>Scores</li>
            <li>Watch</li>
            <li>Odds</li>

            <li>Search</li>
            <li>Sign In</li>
          </ul>
        </nav>
      </aside>

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
