


import React from 'react';
import Swal from 'sweetalert2'; 
import type { IProducto } from '../models/producto-model';
import { useCart } from '../hooks/useCart';
import { formatearPrecio } from '../utils/formatters';



interface Props {
  producto: IProducto;
}

export const ProductCard: React.FC<Props> = ({ producto }) => {
  
  const { addToCart } = useCart();

  // FUNCIÓN 'handleAddToCart'!
  const handleAddToCart = () => {
    // a) Primero, añadimos el producto al "cerebro" 
    addToCart(producto);
    
    // b) Segundo, disparamos la alerta "toast"
    Swal.fire({
      toast: true, // <-- Esto la convierte en la notificación pequeña
      position: 'top', // <-- "arriba de la pagina al medio"
      icon: 'success',
      title: `${producto.nombre} se agregó a tu carrito`,
      showConfirmButton: false, 
      timer: 2000, // Se cierra sola después de 2 segundos
      timerProgressBar: true, // Muestra una barrita de tiempo
      // (No necesitamos 'background' o 'color' porque importamos el 'theme-dark')
    });
  };

  return (
    <div className="col-md-4 mb-4">
      <div className="card bg-dark text-white product-card h-100">
        
        <img src={producto.imagen} className="card-img-top" alt={producto.nombre} />
        
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{producto.nombre}</h5>
          <p className="card-text flex-grow-1">{producto.descripcion}</p>
          <p className="card-text fs-4 fw-bold text-neon">
            {formatearPrecio(producto.precio)}
          </p>
          
          {/* El botón ahora llama a la función actualizada */}
          <button 
            className="btn btn-gamer btn-neon mt-auto"
            onClick={handleAddToCart}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
};