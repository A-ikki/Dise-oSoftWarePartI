// src/components/Register.tsx
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../Services/FirebaseConfi';
import './Login.css'

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Manejar el éxito del registro
    } catch (err: any) {
      setError(err.message);
    }
  };
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Manejar el éxito del inicio de sesión con Google
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="register-container">
      <h2>Registro</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
        />
        <button type="submit">Registrarse</button>
        <button onClick={handleGoogleLogin} className="google-login-button">
        Registrate con Google
      </button>
      </form>
    </div>
  );
};

export default Register;
