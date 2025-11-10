// src/pages/nosotrosPage.tsx
import React from 'react';

// El componente DEBE empezar con Mayúscula (NosotrosPage)
export const NosotrosPage: React.FC = () => {
  return (
    <div className="container mt-5">

      {/* --- 1. SECCIÓN "NUESTRA PARTIDA" --- */}
      <section className="text-center mb-5">
        <h1 className="text-neon mb-3">Nuestra Partida</h1>
        <p className="lead" style={{ maxWidth: '800px', margin: '0 auto' }}>
          Level-Up Gamer no es solo una tienda, es el punto de encuentro para todos los que viven y respiran el mundo del gaming. Nacimos de la pasión por el hardware de alto rendimiento y la cultura de los videojuegos.
        </p>
      </section>

      <hr className="neon-divider my-5" />

      {/* --- 2. SECCIÓN "MISIÓN Y VISIÓN" --- */}
      <section className="mb-5">
        <div className="row">
          
          {/* Tarjeta de Misión */}
          <div className="col-md-6 mb-4">
            <div className="card mission-vision-card h-100">
              <div className="card-body text-center">
                <i className="bi bi-rocket-takeoff-fill display-4 text-neon mb-3"></i>
                <h4 className="card-title text-white">Nuestra Misión</h4>
                <p className="card-text">
                  Equipar a cada jugador con las herramientas necesarias para alcanzar su máximo potencial. Ofrecemos componentes de la más alta calidad y el asesoramiento de verdaderos expertos para que domines en cada partida.
                </p>
              </div>
            </div>
          </div>
          
          {/* Tarjeta de Visión */}
          <div className="col-md-6 mb-4">
            <div className="card mission-vision-card h-100">
              <div className="card-body text-center">
                <i className="bi bi-eye-fill display-4 text-neon mb-3"></i>
                <h4 className="card-title text-white">Nuestra Visión</h4>
                <p className="card-text">
                  Ser la comunidad y tienda de referencia para los gamers de toda Latinoamérica, impulsando la cultura del PC gaming y apoyando a la nueva generación de jugadores, creadores y competidores.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <hr className="neon-divider my-5" />

      {/* --- 3. SECCIÓN "CONOCE AL EQUIPO" --- */}
      <section className="mb-5">
        <h2 className="text-center text-neon mb-5">Conoce al Equipo</h2>
        <div className="row justify-content-center">
          
          {/* Tarjeta de Gonzalo */}
          <div className="col-lg-5 col-md-6 mb-4">
            <div className="card team-card h-100 p-4">
              {/* Asegúrate de tener esta imagen en 'public/img/team/gonzalo.jpg' */}
              <img 
                src="/img/desarrolladores/gonzalo.jpg" 
                className="card-img-top rounded-circle mb-3" 
                alt="Gonzalo Ruiz" 
              />
              <div className="card-body text-center">
                <h3 className="card-title text-white">Gonzalo Ruiz</h3>
                <p className="card-text">
                  "Apasionado por la creación de experiencias web fluidas con interfaces originales y la optimización de cada línea de código para un rendimiento máximo."
                </p>
              </div>
            </div>
          </div>
          
          {/* Tarjeta de David */}
          <div className="col-lg-5 col-md-6 mb-4">
            <div className="card team-card h-100 p-4">
              {/* Asegúrate de tener esta imagen en 'public/img/team/david.jpg' */}
              <img 
                src="/img/desarrolladores/david.jpg" 
                className="card-img-top rounded-circle mb-3" 
                alt="David Torrealba" 
              />
              <div className="card-body text-center">
                <h3 className="card-title text-white">David Torrealba</h3>
                <p className="card-text">
                  "Enfocado en crear interfaces intuitivas y estéticamente impactantes que enganchen al usuario desde el primer clic."
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};