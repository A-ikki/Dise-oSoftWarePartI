// src/components/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import './Layout.css';

const Layout: React.FC = () => {
  return (
    <div className="layout">
      <aside className="sidebar">
        <nav>
          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="/buscar">Buscar</a></li>
            <li><a href="/ligas">Ligas</a></li>
            <li><a href="/hoy">Hoy</a></li>
            <li><a href="/signin">Sign In</a></li>
          </ul>
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
