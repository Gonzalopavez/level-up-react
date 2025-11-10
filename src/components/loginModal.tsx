// src/components/loginModal.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Swal from 'sweetalert2';

export const LoginModal: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      
      // --- ¡¡ARREGLO!! ---
      // Llamamos a 'login' con UN solo objeto, como el "Cerebro" espera
      const result = await login({ email: email, password: password });

      if (result.ok) {
        // Cerramos el modal
        const modalElement = document.getElementById('loginOffcanvas');
        if (modalElement) {
          const modal = (window as any).bootstrap.Offcanvas.getOrCreateInstance(modalElement);
          modal?.hide();
        }
        setEmail('');
        setPassword('');
        navigate('/');
      } else {
        // Usamos el mensaje de error del "Camarero"
        Swal.fire({ icon: 'error', title: 'Error', text: result.mensaje });
      }
    } catch (error) {
      console.error("Error en el login:", error);
      Swal.fire({ icon: 'error', title: 'Error crítico', text: 'No se pudo contactar al cerebro de autenticación.' });
    }
  };

  // --- ARREGLO PARA NAVEGAR (El setTimeout) ---
  const handleNavigateToRegister = () => {
    const modalElement = document.getElementById('loginOffcanvas');
    if (modalElement) {
      const modal = (window as any).bootstrap.Offcanvas.getOrCreateInstance(modalElement);
      modal?.hide();
    }
    setTimeout(() => {
      navigate('/registro');
    }, 300);
  };

  return (
    <div 
      className="offcanvas offcanvas-end offcanvas-login-custom"
      tabIndex={-1} 
      id="loginOffcanvas" 
      aria-labelledby="loginOffcanvasLabel"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title titulo-canvas" id="loginOffcanvasLabel">Iniciar Sesión</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div className="offcanvas-body">
        <form onSubmit={handleSubmit}>
          {/* ... (Campos no cambian) ... */}
          <div className="mb-3">
            <label htmlFor="loginEmail" className="form-label-canvas-correo">Correo Electrónico</label>
            <input type="email" className="form-control" id="loginEmail" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label htmlFor="loginPassword" className="form-label-canvas-contraseña">Contraseña</label>
            <input type="password" className="form-control" id="loginPassword" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary-Entrar w-100 mt-3">Entrar</button>
        </form>

        <div className="text-center mt-4">
          <p className="text-center-no-tiene-cuenta">
            ¿No tienes una cuenta? 
            <button
              type="button"
              className="btn btn-link text-neon" 
              onClick={handleNavigateToRegister}
            >
              Regístrate
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};