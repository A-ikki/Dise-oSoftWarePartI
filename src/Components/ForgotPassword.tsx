import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../Services/FirebaseConfi';
import './ForgotPassword.css';


const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Se ha enviado un enlace de recuperación a tu correo.');
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        setMessage('No se encontró una cuenta con ese correo.');
      } else {
        setMessage('Ocurrió un error al intentar enviar el correo. Verifica la dirección e inténtalo de nuevo.');
      }
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Recuperar Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Introduce tu correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Enviar Enlace de Recuperación</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;