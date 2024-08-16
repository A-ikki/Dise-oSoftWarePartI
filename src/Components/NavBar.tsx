import React from "react";
import { Link } from "react-router-dom";
import './NavBar.css'; // Asegúrate de crear y enlazar este archivo

const links = [
  { name: "LeaguesCarousel", href: "/leaguesCarousel" },
  { name: "Home", href: "/home" },
];

const NavBar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {links.map((link) => (
          <Link key={link.href} to={link.href} className="navbar-link">
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;
