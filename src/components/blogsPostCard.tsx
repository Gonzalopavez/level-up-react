

import React from 'react';
import { NavLink } from 'react-router-dom';

interface BlogPostCardProps {
  title: string;
  snippet: string;
  imageSrc: string;
  linkTo: string; 
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({ title, snippet, imageSrc, linkTo }) => {
  return (
    <div className="col-12 mb-4">
      <div className="card blog-card flex-md-row">
        
        <div className="card-body d-flex flex-column p-4">
          <h3 className="text-white mb-2">{title}</h3>
          <p className="card-text text-secondary flex-grow-1">{snippet}</p>
          {/* 'mt-auto' empuja el botón hacia abajo */}
          <div className="mt-auto">
            {/* El botón morado 'btn-gamer' que es un link */}
            <NavLink to={linkTo} className="btn btn-gamer">
              Leer Más <i className="bi bi-arrow-right-short"></i>
            </NavLink>
          </div>
        </div>

        {/* Columna de Imagen (Derecha) */}
        {/* 'd-none d-md-block' oculta la imagen en móviles para que no se vea mal */}
        <div className="col-md-5 d-none d-md-block">
          <img 
            src={imageSrc} 
            className="blog-card-img" 
            alt={title} 
          />
        </div>

      </div>
    </div>
  );
};