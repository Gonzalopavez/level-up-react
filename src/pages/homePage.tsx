// src/pages/homePage.tsx
import React, { useState, useEffect } from 'react';

import { HeroCarousel } from '../components/heroCarousel';
import { ProductCard } from '../components/productCard';
import { FeatureCard } from '../components/featureCard'; // <-- 1. Importamos la nueva FeatureCard
import { getProductos } from '../services/producto-service';
import type { IProducto } from '../models/producto-model';

export const HomePage: React.FC = () => {

  const [destacados, setDestacados] = useState<IProducto[]>([]);

  useEffect(() => {
    
    const cargarDestacados = async () => {
      try {
        const todosLosProductos = await getProductos();
        const primerosTres = todosLosProductos.slice(0, 3);
        setDestacados(primerosTres);
      } catch (error) {
        console.error("Error al cargar productos destacados:", error);
      }
    };

    cargarDestacados();
  }, []);

  return (
    <div>
      <HeroCarousel />

      <div className="container mt-5">
        
        {/* Sección Productos Destacados */}
        <section id="productos-destacados" className="mb-5" style={{ paddingTop: '70px', marginTop: '-70px' }}>
          
          <h2 className="text-center text-neon mb-4">Productos Destacados</h2>
          
          <div className="row">
            {destacados.length === 0 ? (
              <p className="text-center">Cargando productos...</p>
            ) : (
              destacados.map(producto => (
                <ProductCard key={producto.id} producto={producto} />
              ))
            )}
          </div>
        </section>

        {/* 2. NUEVA SECCIÓN: "Por Qué Elegirnos" */}
        <section id="why-choose-us" className="my-5 py-5">
          <h2 className="text-center text-neon mb-5">¿POR QUÉ ELEGIRNOS?</h2>
          <div className="row">
            {/* Tarjeta 1 */}
            <FeatureCard 
              iconClass="bi bi-truck" 
              title="Envíos a Todo Chile" 
              description="Recibe tu equipamiento gamer en la puerta de tu casa, estés donde estés. Rápido y seguro."
            />
            {/* Tarjeta 2 */}
            <FeatureCard 
              iconClass="bi bi-shield-lock" 
              title="Pagos 100% Seguros" 
              description="Utilizamos las pasarelas de pago más seguras del mercado para que compres con total confianza."
            />
            {/* Tarjeta 3 */}
            <FeatureCard 
              iconClass="bi bi-headset" 
              title="Soporte Gamer Especializado" 
              description="Nuestro equipo está formado por gamers. Te ayudamos a elegir los mejores componentes para ti."
            />
          </div>
        </section>
        {/* Fin de la Nueva Sección */}


        {/* (Aquí irán tus otras secciones: "Testimonios", "Marcas", etc.) */}

      </div>
    </div>
  );
};