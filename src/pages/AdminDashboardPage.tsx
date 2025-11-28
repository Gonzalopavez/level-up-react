// src/pages/AdminDashboardPage.tsx
import React from 'react';

// 1. Importamos los "ladrillos" del Admin
import { GestionProductos } from '../components/admin/gestionProductos';
import { GestionUsuarios } from '../components/admin/gestionUsuarios';

// 2. ¡¡AQUÍ ESTÁ EL CAMBIO!!
// Importamos el componente "inteligente" que acabamos de arreglar
import { VerVentas } from '../components/vendedor/verVentas';

export const AdminDashboardPage: React.FC = () => {
  return (
    <div className="container mt-5 mb-5">
      <h1 className="text-center text-neon mb-4">Panel de Administrador</h1>
      <p className="text-center lead mb-5">
        Administración total del sistema: Productos, Usuarios y Ventas.
      </p>

      {/* --- Pestañas de Navegación --- */}
      <ul className="nav nav-pills nav-fill nav-gamer mb-3" id="adminTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button 
            className="nav-link active" 
            id="productos-tab" 
            data-bs-toggle="tab" 
            data-bs-target="#productos-tab-pane" 
            type="button" 
            role="tab"
          >
            Gestión de Productos
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button 
            className="nav-link" 
            id="usuarios-tab" 
            data-bs-toggle="tab" 
            data-bs-target="#usuarios-tab-pane" 
            type="button" 
            role="tab"
          >
            Gestión de Usuarios
          </button>
        </li>

        {/* --- ¡¡PESTAÑA AÑADIDA!! --- */}
        <li className="nav-item" role="presentation">
          <button 
            className="nav-link" 
            id="ventas-tab" 
            data-bs-toggle="tab" 
            data-bs-target="#ventas-tab-pane" 
            type="button" 
            role="tab"
          >
            Gestión de Ventas
          </button>
        </li>
      </ul>

      {/* --- Contenido de las Pestañas --- */}
      <div className="tab-content bg-dark p-4 rounded-bottom" id="adminTabContent">
        
        {/* Pestaña 1: Productos */}
        <div 
          className="tab-pane fade show active" 
          id="productos-tab-pane" 
          role="tabpanel" 
        >
          <GestionProductos />
        </div>
        
        {/* Pestaña 2: Usuarios */}
        <div 
          className="tab-pane fade" 
          id="usuarios-tab-pane" 
          role="tabpanel" 
        >
          <GestionUsuarios />
        </div>

        {/* --- ¡¡CONTENIDO AÑADIDO!! --- */}
        <div 
          className="tab-pane fade" 
          id="ventas-tab-pane" 
          role="tabpanel" 
        >
          {/* Aquí usamos el MISMO componente que el Vendedor */}
          <VerVentas /> 
        </div>

      </div>
    </div>
  );
};