import React from 'react';
import './Home.css'; // Este archivo contendrá el estilo para la imagen y el título

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <div className="image-overlay">
        <img
          src="./Images/CanchaFulbol.jpg"
          alt="Imagen de fondo"
          className="background-image"
        />
        <h1 className="image-title">Nombre de la pagina</h1>
      </div>
    </div>
    
  );
};

export default Home;
