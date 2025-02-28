import React from 'react';
import icon from '../../img/icon.png'; // Adjust the path based on your file structure
import { useNavigate } from 'react-router-dom'; // Import useNavigate


const Login = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    // Add your authentication logic here (e.g., check email and password)

    // After successful authentication, redirect to App.tsx
    navigate('/home');
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        backgroundColor: '#222', // Dark background color
        color: '#fff',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Left Side: Solid Purple Background */}
      <div
        style={{
          flex: 1.5,
          backgroundColor: '#4a148c', // Use your desired purple color
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', // Center content vertically
          alignItems: 'center', // Center content horizontally
        }}
      >
        {/* Custom Logo (replace with your actual logo path) */}
        <img
          src={icon} // Use the imported 'icon' variable
          alt="Your Logo"
          style={{ maxWidth: '80%', maxHeight: '200px' }}
        />
      </div>

      {/* Right Side: Login Form */}
      <div
        style={{
          flex: 0.7,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', // Center content vertically
          alignItems: 'center', // Center content horizontally
          padding: '2rem',
        }}
      >
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>Iniciar sesión</h1> {/* Center the heading text */}
        <p style={{ marginBottom: '2rem', color: '#ccc', textAlign: 'center' }}> {/* Center the paragraph text */}
          Inicia sesión para acceder a tu cuenta
        </p>

        <form
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', // Center the form content horizontally
          }}
          onSubmit={handleSubmit} // Attach the handleSubmit function to the form
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
            />
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#673AB7', // Purple
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

          {/*  Remove google sign */}
        </form>
      </div>
    </div>
  );
};

export default Login;