// src/App.tsx
import React, { useState } from 'react';
import Header from './Components/header';
import Sidebar from './Components/Sidebar';

const App: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div>
      <Header onMenuClick={handleMenuClick} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
      <div className="content">
        {/* Aquí puedes añadir el contenido de tu aplicación */}
        <h1>Aqui van la news</h1>
      </div>
    </div>
  );
};

export default App;
