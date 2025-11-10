// src/components/blogPostCard.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';

interface BlogPostCardProps {
  title: string;
  snippet: string;
  imageSrc: string;
  linkTo: string; // La URL a la que debe ir, ej: "/blogs/rtx-4090"
}

// El componente DEBE empezar con Mayúscula (BlogPostCard)
export const BlogPostCard: React.FC<BlogPostCardProps> = ({ title, snippet, imageSrc, linkTo }) => {
  return (
    // 'mb-4' para espaciado
    <div className="col-12 mb-4">
      {/* 'blog-card' es nuestra clase CSS personalizada.
        'd-flex' (display: flex) para poner la imagen y el texto uno al lado del otro.
      */}
      <div className="card blog-card flex-md-row">
        
        {/* Columna de Texto (Izquierda) */}
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