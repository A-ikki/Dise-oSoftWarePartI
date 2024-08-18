import React from 'react';
import Home from './Pages/Home';
import Footer from './Components/Footer';
import LeaguesCarousel from './Pages/LeaguesCarousel';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './Components/NavBar';
import Login from './Components/Login';
import Register from './Components/Register';

const App: React.FC = () => {
  return (
    <div className="app">
      <Router>
        <NavBar />
        <main>
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path="/home" element={<Home />} />
            <Route path="/leaguesCarousel" element={<LeaguesCarousel />} />
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
