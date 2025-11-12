
import React from 'react';

// Definimos los "moldes" de las propiedades que va a recibir
interface FeatureCardProps {
  iconClass: string; // Ej: "bi bi-truck"
  title: string;     // Ej: "Envíos a Todo Chile"
  description: string; // Ej: "Recibe tu equipo..."
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ iconClass, title, description }) => {
  return (
    // 'col-md-4' para 3 columnas en pantallas medianas y grandes
    // 'mb-4' para margen inferior
    <div className="col-md-4 mb-4">
      <div className="feature-card text-center p-4">
        <i className={`${iconClass} display-4 text-neon mb-3`}></i> {/* Ícono */}
        <h3 className="text-white mb-2">{title}</h3> {/* Título */}
        <p className="text-secondary">{description}</p> {/* Descripción */}
      </div>
    </div>
  );
};