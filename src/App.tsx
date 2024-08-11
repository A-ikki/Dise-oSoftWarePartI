// src/App.tsx
import React, { useState } from 'react';
import Header from './Components/header';
import Sidebar from './Components/Sidebar';
import LeaguesCarousel from './Pages/LeaguesCarousel';
import Home from './Pages/Home'
import Footer from './Components/Footer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


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
      <Home/>
      <div className="content">
        {/* Aquí puedes añadir el contenido de tu aplicación */}
   
        <LeaguesCarousel/> 
      </div>
      
      <Footer/>
    </div>
    
  );
};

export default App;
