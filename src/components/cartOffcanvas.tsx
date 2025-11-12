
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart'; // <-- El "cerebro"
import { formatearPrecio } from '../utils/formatters';


export const CartOffcanvas: React.FC = () => {

  //"sacamos" 'totalPedido' directamente del "cerebro"
  const { 
    cartItems, 
    removeFromCart, 
    clearCart, 
    addToCart, 
    decreaseQuantity, 
    totalPedido // <-- Lo leemos desde el hook
  } = useCart();
  
  const navigate = useNavigate();

  

  const handleGoToCheckout = () => {
    const modalElement = document.getElementById('offcanvasCarrito');
    if (modalElement) {
      const modal = (window as any).bootstrap.Offcanvas.getOrCreateInstance(modalElement);
      modal?.hide();
    }
    setTimeout(() => {
      navigate('/carrito');
    }, 300);
  };

  return (
    <div 
      className="offcanvas offcanvas-end bg-dark text-white"
      tabIndex={-1} 
      id="offcanvasCarrito"
      aria-labelledby="offcanvasCarritoLabel"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasCarritoLabel">
          <i className="bi bi-cart text-neon me-2"></i>Mi Carrito
        </h5>
        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      
      <div className="offcanvas-body">
        
        {cartItems.length === 0 ? (
          <div className="text-center mt-5">
            <p className="fs-4">Tu carrito está vacío.</p>
          </div>
        ) : (
          <div>
            {cartItems.map(item => (
              <div key={item.producto.id}>
                <div className="d-flex mb-3">
                  <img src={item.producto.imagen} alt={item.producto.nombre} className="img-fluid rounded" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                  <div className="ms-3 flex-grow-1">
                    <h6 className="mb-0">{item.producto.nombre}</h6>
                    <button className="btn btn-link text-danger p-0" onClick={() => removeFromCart(item.producto.id)}>
                      <small><i className="bi bi-trash"></i> Quitar</small>
                    </button>
                  </div>
                  <div className="ms-auto text-end">
                    <div className="fw-bold mb-2">{formatearPrecio(item.producto.precio * item.cantidad)}</div>
                    <div className="d-flex justify-content-end align-items-center">
                      <button className="btn btn-gamer btn-sm" style={{ padding: '0.1rem 0.5rem' }} onClick={() => decreaseQuantity(item.producto.id)}>-</button>
                      <span className="mx-2 fw-bold">{item.cantidad}</span>
                      <button className="btn btn-gamer btn-sm" style={{ padding: '0.1rem 0.5rem' }} onClick={() => addToCart(item.producto)}>+</button>
                    </div>
                  </div>
                </div>
                <hr className="border-secondary" />
              </div>
            ))}
            
            <hr className="neon-divider" />
            
            <div className="text-end mb-3">
              {/* Usamos el 'totalPedido' del hook */}
              <h4 className="mb-0">Total: {formatearPrecio(totalPedido)}</h4>
            </div>
            
            <div className="d-grid gap-2">
              <button 
                type="button"
                className="btn btn-gamer"
                onClick={handleGoToCheckout}
              >
                Ir a Pagar
              </button>
              <button 
                className="btn btn-danger"
                onClick={clearCart}
              >
                Vaciar Carrito
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};