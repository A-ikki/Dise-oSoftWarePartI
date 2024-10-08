// App.ts
import React from 'react';
import Home from './Pages/Home';
import Footer from './Components/Footer';
import LeaguesCarousel from './Pages/LeaguesCarousel';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './Components/NavBar';
import Login from './Components/Login';
import Register from './Components/Register';
import PlayerSearch from './Pages/PlayerSearch';
import FavoritesList from './Pages/FavoriteList';
import TeamsCarousel from './Pages/TeamsCarousel';

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
            <Route path="/teamsCarousel" element={<TeamsCarousel/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/playerSearch' element={<PlayerSearch/>} />
            <Route path='/favoriteList' element={<FavoritesList/>} />

          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
