import React from 'react';
import Home from './Pages/Home';
import Footer from './Components/Footer';
import LeaguesCarousel from './Pages/LeaguesCarousel';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './Components/NavBar';

const App: React.FC = () => {
  return (
    <div className="app">
      <Router>
        <NavBar />
        <main>
        <Home/>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/leaguesCarousel" element={<LeaguesCarousel />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
