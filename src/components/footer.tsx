
import React from 'react';

// Sin 'props' aquí, porque el footer es siempre
// el mismo. Es un componente estático.


export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white mt-5 p-4 text-center">
      <div className="container">
        <div className="row align-items-center">
          {/* Columna del Logo */}
          <div className="col-md-4 text-md-start mb-3 mb-md-0">
            <a href="/" className="d-inline-block">
              {}
              <img src="/img/logo.png" alt="Logo LevelUp Gamer" height="50" />
            </a>
          </div>

          {/* Columna de Copyright */}
          <div className="col-md-4 mb-3 mb-md-0">
            <p className="mb-0">&copy; 2025 LEVEL-UP GAMER. Todos los derechos reservados.</p>
            <p className="mb-0 small">Sitio desarrollado para fines académicos.</p>
          </div>

          {/* Columna de Redes Sociales */}
          <div className="col-md-4 text-md-end">
            <a href="#" className="text-white me-3 fs-4"><i className="bi bi-facebook"></i></a>
            <a href="#" className="text-white me-3 fs-4"><i className="bi bi-twitter-x"></i></a>
            <a href="#" className="text-white me-3 fs-4"><i className="bi bi-instagram"></i></a>
            <a href="#" className="text-white fs-4"><i className="bi bi-twitch"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};