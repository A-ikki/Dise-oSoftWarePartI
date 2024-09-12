import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from '../Services/FirebaseConfi';
import './Home.css';

const Home: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div className="home-wrapper">
      <div className="home-container">

        <div className="left-content">
          <div className="welcome-content">
            <h1 className="image-title">Welcome</h1>
            <p className="welcome-message">
              Join the largest football community. Follow your favorite leagues and teams.
            </p>
            <div className="action-buttons">
              <Link to="/leaguesCarousel" className="action-button">Leagues</Link>
              {user ? (
                <button onClick={handleLogout} className="action-button">Logout</button>
              ) : (
                <Link to="/login" className="action-button">Login</Link>
              )}
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
