// src/components/NavBar.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../Services/FirebaseConfi';
import Logout from "./Logout";
import './NavBar.css';

const NavBar: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Si hay un usuario, está autenticado
    });

    return () => unsubscribe(); // Limpia la suscripción cuando el componente se desmonte
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {isAuthenticated ? (
          <>
            <Link to="/leaguesCarousel" className="navbar-link">LeaguesCarousel</Link>
            <Link to="/home" className="navbar-link">Home</Link>
            <Link to ="/playerSearch" className="navbar-link">Player search</Link>
            <Link to = "/favoriteList" className="navbar-link">Favorites</Link>
            <Logout />
          </>
        ) : (
          <>
            <Link to="/home" className="navbar-link">Home</Link>
            <Link to="/leaguesCarousel" className="navbar-link">LeaguesCarousel</Link>
            <Link to="/login" className="navbar-link">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
