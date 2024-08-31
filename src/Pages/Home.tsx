import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-wrapper">
      <div className="home-container">
        {/* Sección de contenido izquierdo */}
        <div className="left-content">
          <div className="welcome-content">
            <h1 className="image-title">Welcome</h1>
            <p className="welcome-message">
            Join the largest football community. Follow your favorite leagues and teams.
            </p>
            <div className="action-buttons">
              <Link to="/leaguesCarousel" className="action-button">Leagues</Link>
              <Link to="/login" className="action-button">SigIn</Link>
            </div>
          </div>
        </div>
        
        {/* Sección de imagen de fondo */}
        <div className="right-content">
          <img
            src="./Images/CanchaFulbol.jpg"
            alt="Imagen de fondo"
            className="background-image"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
