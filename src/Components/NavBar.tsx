// src/components/NavBar.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from '../Services/FirebaseConfi';
import './NavBar.css';

const NavBar: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setIsDropdownOpen(false); // Cierra el menú después de cerrar sesión
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prevState => !prevState);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/home" className="navbar-link">Home</Link>
        <Link to="/leaguesCarousel" className="navbar-link">LeaguesCarousel</Link>

        {user ? (
          <>
            <Link to="/playerSearch" className="navbar-link">Player search</Link>
            <Link to="/favoriteList" className="navbar-link">Favorites</Link>
            <div className="navbar-user" onClick={toggleDropdown}>
              <img
                src={user.photoURL || "https://via.placeholder.com/40"}
                alt="User Profile"
                className="user-profile-pic"
              />
              {isDropdownOpen && (
                <div className="user-dropdown">
                  <p>{user.displayName}</p>
                  <p>{user.email}</p>
                  <button onClick={handleLogout}>Cerrar Sesión</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link to="/login" className="navbar-link">Login</Link>
        )}
      </div>

      {/* Captura clics fuera del menú para cerrarlo */}
      {isDropdownOpen && (
        <div className="overlay" onClick={closeDropdown} />
      )}
    </nav>
  );
};

export default NavBar;
