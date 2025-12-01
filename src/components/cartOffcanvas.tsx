import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { formatearPrecio } from '../utils/formatters';

export const CartOffcanvas: React.FC = () => {

  const { 
    cartItems,
    removeFromCart,
    clearCart,
    addToCart,
    decreaseQuantity,

    
    subTotal,
    descuento,
    totalFinal,
    descuentoActivo,
    setDescuentoActivo
  } = useCart();

  const navigate = useNavigate();

  const handleGoToCheckout = () => {
    const modalElement = document.getElementById('offcanvasCarrito');
    if (modalElement) {
      const modal = (window as any).bootstrap.Offcanvas.getOrCreateInstance(modalElement);
      modal?.hide();
    }
    setTimeout(() => navigate('/carrito'), 300);
  };

  return (
    <div 
      className="offcanvas offcanvas-end bg-dark text-white"
      tabIndex={-1} 
      id="offcanvasCarrito"
      aria-labelledby="offcanvasCarritoLabel"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title">
          <i className="bi bi-cart text-neon me-2"></i>Mi Carrito
        </h5>
        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
      </div>
      
      <div className="offcanvas-body">
        
        {cartItems.length === 0 ? (
          <div className="text-center mt-5">
            <p className="fs-4">Tu carrito está vacío.</p>
          </div>
        ) : (
          <div>

            {/* LISTA DE PRODUCTOS */}
            {cartItems.map(item => (
              <div key={item.producto.id}>
                <div className="d-flex mb-3">
                  <img 
                    src={item.producto.imagen}
                    alt={item.producto.nombre}
                    className="img-fluid rounded"
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                  />

                  <div className="ms-3 flex-grow-1">
                    <h6 className="mb-0">{item.producto.nombre}</h6>

                    <button 
                      className="btn btn-link text-danger p-0"
                      onClick={() => removeFromCart(item.producto.id)}
                    >
                      <small><i className="bi bi-trash"></i> Quitar</small>
                    </button>
                  </div>

                  <div className="ms-auto text-end">
                    <div className="fw-bold mb-2">
                      {formatearPrecio(item.producto.precio * item.cantidad)}
                    </div>

                    <div className="d-flex justify-content-end">
                      <button className="btn btn-gamer btn-sm" onClick={() => decreaseQuantity(item.producto.id)}>-</button>
                      <span className="mx-2 fw-bold">{item.cantidad}</span>
                      <button className="btn btn-gamer btn-sm" onClick={() => addToCart(item.producto)}>+</button>
                    </div>
                  </div>
                </div>

                <hr className="border-secondary" />
              </div>
            ))}

            <hr className="neon-divider" />

            {/* INTERRUPTOR DESCUENTO */}
            <div className="form-check form-switch mb-3">
              <input 
                className="form-check-input"
                type="checkbox"
                checked={descuentoActivo}
                onChange={e => setDescuentoActivo(e.target.checked)}
              />
              <label className="form-check-label">
                Aplicar descuento 20% DUOC
              </label>
            </div>

            {/* RESUMEN */}
            <p className="d-flex justify-content-between text-white">
              <span>Subtotal:</span>
              <strong>{formatearPrecio(subTotal)}</strong>
            </p>

            <p className="d-flex justify-content-between text-warning">
              <span>Descuento:</span>
              <strong>- {formatearPrecio(descuento)}</strong>
            </p>

            <p className="d-flex justify-content-between fs-4 text-success">
              <span>Total:</span>
              <strong>{formatearPrecio(totalFinal)}</strong>
            </p>

            <div className="d-grid gap-2 mt-3">
              <button className="btn btn-gamer" onClick={handleGoToCheckout}>
                Ir a pagar
              </button>

              <button className="btn btn-danger" onClick={clearCart}>
                Vaciar carrito
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
