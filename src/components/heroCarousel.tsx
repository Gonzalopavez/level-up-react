

import React from 'react';
// 1. Importamos NavLink para los links internos (como "/nosotros")
import { NavLink } from 'react-router-dom';


export const HeroCarousel: React.FC = () => {

  //    ACTUALIZAMOS LA "BASE DE DATOS" DEL CARRUSEL
  //    Ahora cada slide tiene su propio botón y link
  const banners = [
    { 
      img: '/img/intro.png', 
      alt: 'Banner Promociones',
      buttonText: 'Ver Productos Destacados',
      linkType: 'anchor', // "anchor" significa un link para "bajar"
      linkTo: '#productos-destacados' // Este ID lo pondremos en homePage.tsx
    },
    { 
      img: '/img/siguenos.png', 
      alt: 'Banner Nuevos Ingresos',
      buttonText: 'Síguenos en Instagram',
      linkType: 'external', // "external" significa un link a otra web
      linkTo: 'https://www.instagram.com' // (Puedes cambiar esta URL)
    },
    { 
      img: '/img/origenes.png', 
      alt: 'Banner Marcas',
      buttonText: 'Conócenos',
      linkType: 'internal', // "internal" significa un link de React Router
      linkTo: '/nosotros' // El link a tu página "Nosotros"
    },
  ];




  //    FUNCIÓN INTELIGENTE PARA CREAR EL BOTÓN
  //    Esta función decide qué etiqueta HTML usar (<a> o <NavLink>)
  const renderButton = (banner: typeof banners[0]) => {
    
    const className = "btn btn-gamer btn-lg"; 
    
    switch (banner.linkType) {
      // Caso 1: Para "bajar" (Ver Productos)
      case 'anchor':
        return <a href={banner.linkTo} className={className}>{banner.buttonText}</a>;
      
      // Caso 2: Para "ir a otra página" (Nosotros)
      case 'internal':
        return <NavLink to={banner.linkTo} className={className}>{banner.buttonText}</NavLink>;
      
      // Caso 3: Para "ir a otra web" (Instagram)
      case 'external':
        return <a href={banner.linkTo} target="_blank" rel="noopener noreferrer" className={className}>{banner.buttonText}</a>;
      
      default:
        return null;
    }
  };

  return (
    <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
      
      {/* Indicadores (los 3 puntitos de abajo) */}
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>
      
      <div className="carousel-inner">
        {banners.map((banner, index) => (
          <div 
            key={index}
            className={`carousel-item ${index === 0 ? 'active' : ''}`}
          >
            <img 
              src={banner.img} 
              className="d-block w-100 carousel-image" 
              alt={banner.alt} 
            />
            <div className="carousel-caption d-none d-md-block carousel-caption-button">
              {renderButton(banner)}
            </div>
          </div>
        ))}
      </div>

      {/* Controles (flechas izq/der) */}
      <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};