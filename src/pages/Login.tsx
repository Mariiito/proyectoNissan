import React, { useState } from 'react';
import icon from '../../img/icon.png';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Inicio de sesión exitoso
        console.log('Inicio de sesión exitoso.');
        navigate('/home'); // Redirige a la ruta /home
      } else {
        // Credenciales inválidas
        setErrorMessage(data.message || 'Error al iniciar sesión.');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      setErrorMessage('Error al conectar con el servidor. Revisa la consola.');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        backgroundColor: '#222',
        color: '#fff',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          flex: 1.5,
          backgroundColor: '#4a148c',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          src={icon}
          alt="Your Logo"
          style={{ maxWidth: '80%', maxHeight: '200px' }}
        />
      </div>

      <div
        style={{
          flex: 0.7,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
        }}
      >
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>Iniciar sesión</h1>
        <p style={{ marginBottom: '2rem', color: '#ccc', textAlign: 'center' }}>
          Inicia sesión para acceder a tu cuenta
        </p>

        <form
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          onSubmit={handleSubmit}
        >
          <div style={{ marginBottom: '.5rem', width: '90%', display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', color: '#fff' }}>
              Correo
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="ejemplo@gruponissauto.com.mx"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #444',
                backgroundColor: '#333',
                color: '#fff',
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem', width: '90%', display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', color: '#fff' }}>
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="****************"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #444',
                backgroundColor: '#333',
                color: '#fff',
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {errorMessage && (
            <div style={{ color: 'red', marginBottom: '1rem' }}>{errorMessage}</div>
          )}

          <button
            type="submit"
            style={{
              backgroundColor: '#673AB7',
              color: '#fff',
              padding: '0.85rem .5rem',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              width: '90%',
            }}
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;