// src/components/Logout.tsx
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../Services/FirebaseConfi';

const Logout: React.FC = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirigir al usuario después del logout, si es necesario
      console.log('Usuario desconectado');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <button onClick={handleLogout}>
      Cerrar Sesión
    </button>
  );
};

export default Logout;
