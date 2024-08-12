import React from 'react';
import './Home.css';

const Home: React.FC = () => {
  return (
    
    <div className="home-container">
      <div className="image-overlay">
        <img
          src="./Images/CanchaFulbol.jpg"
          alt="Imagen de fondo"
          className="background-image"
        />
        <div className="welcome-content">
          <h1 className="image-title">Bienvenido a Nombre de la Página</h1>
          <p className="welcome-message">
            Únete a la comunidad de fútbol más grande. Sigue tus ligas y equipos favoritos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
