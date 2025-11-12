
import React from 'react';
import { useAuth } from '../hooks/useAuth';
// 1. Importa el componente de la tabla
import { GestionProductos } from '../components/admin/gestionProductos';

export const AdminDashboardPage: React.FC = () => {
  
  const { currentUser } = useAuth();

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col">
          
          <h1 className="text-neon">Panel de Administración</h1>
          
          {currentUser && (
            <h2 className="fs-4">Bienvenido, {currentUser.nombre}.</h2>
          )}

          <p className="lead">
            Desde aquí puedes gestionar los productos de la tienda.
          </p>

          <hr className="neon-divider" />
          
          <div className="mt-4">
            {/* 2. "Monta" el componente de gestión.
                Este componente ahora se encarga de TODO:
                el botón, la tabla y el modal.
            */}
            <GestionProductos />
          </div>

        </div>
      </div>
    </div>
  );
};