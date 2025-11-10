// src/pages/productosPage.tsx

// src/pages/contactoPage.tsx
import React, { useState } from 'react';
import Swal from 'sweetalert2'; 

// --- ¡¡AQUÍ ESTÁ EL ARREGLO!! ---
// Esta línea EXPORTA el componente con el nombre 'ContactoPage' (con 'C' mayúscula)
// que es el nombre que 'appRouter' está buscando.
export const ContactoPage: React.FC = () => {

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [comentario, setComentario] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    console.log("Formulario enviado:", { nombre, email, comentario });
    Swal.fire({
      title: '¡Mensaje Enviado!',
      text: 'Gracias por contactarnos, te responderemos a la brevedad.',
      icon: 'success',
      timer: 3000,
      timerProgressBar: true
    });
    setNombre('');
    setEmail('');
    setComentario('');
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row align-items-center">

        {/* --- Columna Izquierda (Info) --- */}
        <div className="col-lg-5 col-md-6 mb-4 mb-md-0">
          <h1 className="text-neon" style={{ fontSize: '3rem' }}>Ponte en Contacto</h1>
          <p className="lead text-secondary mb-4">
            ¿Tienes dudas sobre un producto o necesitas ayuda con tu compra? Nuestro equipo de soporte gamer está listo para ayudarte.
          </p>
          <hr className="neon-divider" />
          <div className="contact-info mt-4">
            <p className="fs-5 mb-3">
              <i className="bi bi-envelope-fill text-neon me-3"></i>
              levelupgamer@level.cl
            </p>
            <p className="fs-5">
              <i className="bi bi-telephone-fill text-neon me-3"></i>
              +56 9 1234 5678
            </p>
          </div>
        </div>

        {/* --- Columna Derecha (Formulario) --- */}
        <div className="col-lg-7 col-md-6">
          <div className="contact-form-container p-4 p-md-5">
            <form onSubmit={handleSubmit}>
              
              <div className="mb-3">
                <label htmlFor="nombreCompleto" className="form-label">Nombre Completo</label>
                {/* Inputs con fondo blanco (sin 'form-control-dark') */}
                <input 
                  type="text" 
                  className="form-control" 
                  id="nombreCompleto"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required 
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="correoElectronico" className="form-label">Correo Electrónico</label>
                <input 
                  type="email" 
                  className="form-control" 
                  id="correoElectronico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="comentario" className="form-label">Comentario</label>
                <textarea 
                  className="form-control" 
                  id="comentario" 
                  rows={5}
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  required
                ></textarea>
              </div>
              
              <div className="d-grid">
                <button type="submit" className="btn btn-gamer btn-lg">
                  Enviar Mensaje
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};