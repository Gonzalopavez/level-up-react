// src/pages/vendedorPage.tsx
import React from 'react';
import { GestionStockVendedor } from '../components/vendedor/gestionStockVendedor';
import { VerVentas } from '../components/vendedor/verVentas';

export const VendedorPage: React.FC = () => {
  return (
    <div className="container mt-5 mb-5">
      <h1 className="text-center text-neon mb-4">Panel del Vendedor</h1>
      <p className="text-center lead mb-5">
        Gestiona el inventario y revisa el historial de ventas.
      </p>

      {/* --- Pestañas de Navegación  --- */}
    
      <ul className="nav nav-pills nav-fill nav-gamer mb-3" id="vendedorTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button 
            className="nav-link active" 
            id="stock-tab" 
            data-bs-toggle="tab" 
            data-bs-target="#stock-tab-pane" 
            type="button" 
            role="tab"
          >
            Gestión de Stock
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button 
            className="nav-link" 
            id="ventas-tab" 
            data-bs-toggle="tab" 
            data-bs-target="#ventas-tab-pane" 
            type="button" 
            role="tab"
          >
            Ver Ventas
          </button>
        </li>
      </ul>

      {/* --- Contenido de las Pestañas --- */}
      {/* (Bootstrap requiere que el 'rounded-bottom' se quite si no usamos tabs) */}
      <div className="tab-content bg-dark p-4 rounded" id="vendedorTabContent">
        
        {/* Pestaña 1: Stock */}
        <div 
          className="tab-pane fade show active" 
          id="stock-tab-pane" 
          role="tabpanel" 
        >
          <GestionStockVendedor />
        </div>
        
        {/* Pestaña 2: Ventas */}
        <div 
          className="tab-pane fade" 
          id="ventas-tab-pane" 
          role="tabpanel" 
        >
          <VerVentas />
        </div>
      </div>
    </div>
  );
};