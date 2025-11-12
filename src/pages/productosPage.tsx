

import React, { useState, useEffect } from 'react';
import type { IProducto } from '../models/producto-model';
import { getProductos } from '../services/producto-service';
import { ProductCard } from '../components/productCard';
import { useSearch } from '../hooks/useSearch';

const categorias = [
  "Todos",
  "Periféricos",
  "Monitores",
  "Componentes",
  "Audio"
];

export const ProductosPage: React.FC = () => {
  
  const [productos, setProductos] = useState<IProducto[]>([]);
  const { searchTerm } = useSearch(); 
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const data = await getProductos();
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };
    cargarProductos();
  }, []); 

  const productosFiltrados = productos.filter(producto => {
    const coincideBusqueda = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const coincideCategoria = categoriaSeleccionada === 'Todos' || producto.categoria === categoriaSeleccionada;
    return coincideBusqueda && coincideCategoria;
  });

  return (
    <div className="container mt-5">
      
      {/* Fila de Título y Filtro (no cambia) */}
      <div className="row mb-4 align-items-center">
        <div className="col-md-8">
          {searchTerm ? (
            <h1 className="text-neon mb-0">Resultados para: "{searchTerm}"</h1>
          ) : (
            <h1 className="text-neon mb-0">¡Nuestros Productos!</h1>
          )}
        </div>
        
        <div className="col-md-4">
          <label htmlFor="categoryFilter" className="form-label">Filtrar por Categoría:</label>
          <select 
            id="categoryFilter" 
            className="form-select form-select-dark"
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          >
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>
      

      <div className="row mt-5">
        
        {productos.length === 0 && (
          <p className="text-center">Cargando productos...</p>
        )}
        
        {productos.length > 0 && productosFiltrados.length === 0 && (
          <p className="text-center">
            No se encontraron productos que coincidan con tu búsqueda y filtro.
          </p>
        )}

        {productosFiltrados.map((producto) => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
  );
};