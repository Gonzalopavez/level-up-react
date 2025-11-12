

import React from 'react';
import { NavLink } from 'react-router-dom';

export const BlogPostRtx4090Page: React.FC = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-9"> {/* Contenido más ancho para un blog */}
          
          {/* --- Cabecera del Artículo --- */}
          <header className="text-center mb-4">
            <h1 className="text-neon mb-3" style={{ fontSize: '2.8rem' }}>
              ¿Es la RTX 4090 la reina indiscutible? Analizamos su poder
            </h1>
            <p className="text-secondary">
              Publicado el 22 de Septiembre, 2025 | por Level-Up Gamer
            </p>
          </header>

          {/* --- Cuerpo del Artículo --- */}
          <article className="blog-content">
            <p className="lead">
              La última bestia de NVIDIA llegó para romper todos los benchmarks. Pero, ¿vale la pena la inversión? Desglosamos su rendimiento en los juegos más exigentes del 2025 y te contamos si es el componente que tu setup necesita para alcanzar la gloria.
            </p>
            <p>
              Desde su lanzamiento, la RTX 4090 ha sido el objeto de deseo de todo entusiasta del PC gaming. Con sus 24 GB de memoria GDDR6X y la arquitectura Ada Lovelace, promete un salto generacional no solo en rasterización pura, sino también en las tecnologías que definen el futuro de los gráficos: el Ray Tracing y el DLSS 3 con Frame Generation.
            </p>
            
            {/* Imagen Principal  */}
            <img 
              src="/img/blog/rtx4090-post.jpg"
              className="img-fluid rounded my-4" 
              alt="RTX 4090 en un setup" 
            />

            <blockquote className="blockquote blog-quote my-4">
              <p>"Jugar en 4K a más de 120 FPS con todo en ultra y Ray Tracing activado deja de ser un sueño para convertirse en el nuevo estándar."</p>
            </blockquote>

            <p>
              Hemos sometido a la tarjeta a una batería de pruebas exhaustivas. En títulos como "Cyberpunk 2077: Phantom Liberty" y el nuevo "Starfield", la diferencia es abismal. El DLSS 3 es, sin duda, la salsa secreta de NVIDIA: la generación de fotogramas por IA consigue duplicar el framerate en situaciones donde la GPU estaría al límite, ofreciendo una fluidez que redefine la experiencia de juego. Sin embargo, no todo es perfecto. Su consumo energético y su tamaño físico son dos factores a considerar para cualquier build.
            </p>
            
      
          </article>
          
          <hr className="neon-divider my-5" />

          {/* --- Botón de Volver --- */}
          <div className="text-center mb-5">
            <NavLink to="/blogs" className="btn btn-outline-light">
              <i className="bi bi-arrow-left-short"></i> Volver al Blog
            </NavLink>
          </div>

        </div>
      </div>
    </div>
  );
};