

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { formatearPrecio } from '../utils/formatters';


import { guardarOrden } from '../services/orden-service'; // 1. Importamos al "Camarero"
import type { IOrden } from '../models/orden-model'; // 2. Importamos el "Molde"

// (Regiones y comunas 
const regionesYComunas = [
    { nombre: "Región Metropolitana", comunas: ["Santiago", "Providencia", "Las Condes"] },
    { nombre: "Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Quilpué"] },
    { nombre: "Biobío", comunas: ["Concepción", "Talcahuano", "San Pedro de la Paz"] },
];

export const CheckoutPage: React.FC = () => {
  const { currentUser } = useAuth();
  // Pedimos cartItems y totalPedido (para guardarlos) y clearCart (para después)
  const { cartItems, totalPedido, clearCart } = useCart();
  const navigate = useNavigate();

  // (Estados del formulario 
  const [formData, setFormData] = useState({
    nombre: '', apellidos: '', direccion: '', region: '', comuna: '', metodoPago: 'debito',
  });
  const [comunas, setComunas] = useState<string[]>([]);

  // (Efecto de auto-rellenado 
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        nombre: currentUser.nombre,
        apellidos: currentUser.apellidos,
        // (Podríamos añadir los otros campos a IUsuario si quisiéramos auto-rellenar todo)
      }));
    }
  }, [currentUser]);

  // (Handlers del formulario 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regionNombre = e.target.value;
    setFormData(prev => ({ ...prev, region: regionNombre, comuna: '' }));
    const regionEncontrada = regionesYComunas.find(r => r.nombre === regionNombre);
    setComunas(regionEncontrada ? regionEncontrada.comunas : []);
  };


  // --- LÓGICA DE GUARDADO ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Verificación (¡No podemos guardar una orden sin un usuario!)
    if (!currentUser) {
      Swal.fire('Error', 'Debes iniciar sesión para comprar.', 'error');
      return;
    }
    
    // 2. Creamos el objeto "Orden"
    const nuevaOrden: IOrden = {
      id: Date.now(), // ID único basado en el tiempo
      fecha: new Date().toLocaleString('es-CL'), // Fecha y hora actual
      cliente: currentUser, // El usuario logueado
      items: cartItems, // Los items del carrito
      total: totalPedido // El total del carrito
    };

    // 3. Llamamos al "Camarero" para que la guarde
    const exito = guardarOrden(nuevaOrden);

    if (exito) {
      // 4. Si se guardó bien, mostramos la alerta, limpiamos y navegamos
      Swal.fire({
        title: '¡Compra Exitosa!',
        text: 'Tu pedido ha sido procesado y será enviado a la brevedad.',
        icon: 'success',
        timer: 3000,
        timerProgressBar: true
      }).then(() => {
        clearCart(); // Limpiamos el carrito
        navigate('/'); // Enviamos al Home
      });
    } else {
      // 5. Si falló el guardado (raro, pero puede pasar)
      Swal.fire('Error', 'No se pudo guardar tu orden. Intenta de nuevo.', 'error');
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h1 className="text-neon mb-4">Finalizar Compra</h1>
      
    
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-7">
            <div className="checkout-container p-4 mb-4">
              <h3 className="text-white mb-3">Dirección de Envío</h3>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre</label>
                  <input type="text" className="form-control" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="apellidos" className="form-label">Apellidos</label>
                  <input type="text" className="form-control" id="apellidos" name="apellidos" value={formData.apellidos} onChange={handleChange} required />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="direccion" className="form-label">Dirección</label>
                <input type="text" className="form-control" id="direccion" name="direccion" placeholder="Calle, número, depto." value={formData.direccion} onChange={handleChange} required />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="region" className="form-label">Región</label>
                  <select className="form-select" id="region" name="region" value={formData.region} onChange={handleRegionChange} required>
                    <option value="">Seleccionar...</option>
                    {regionesYComunas.map(r => <option key={r.nombre} value={r.nombre}>{r.nombre}</option>)}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="comuna" className="form-label">Comuna</label>
                  <select className="form-select" id="comuna" name="comuna" value={formData.comuna} onChange={handleChange} required disabled={comunas.length === 0}>
                    <option value="">Seleccionar...</option>
                    {comunas.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="checkout-container p-4">
              <h3 className="text-white mb-3">Método de Pago</h3>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="metodoPago" id="pagoDebito" value="debito" checked={formData.metodoPago === 'debito'} onChange={handleChange} />
                <label className="form-check-label" htmlFor="pagoDebito">Tarjeta de Débito</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="metodoPago" id="pagoCredito" value="credito" checked={formData.metodoPago === 'credito'} onChange={handleChange} />
                <label className="form-check-label" htmlFor="pagoCredito">Tarjeta de Crédito</label>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="checkout-container p-4">
              <h3 className="text-white mb-3 d-flex justify-content-between">
                Resumen del Pedido
                <span className="badge bg-primary rounded-pill">{cartItems.length}</span>
              </h3>
              <ul className="list-group list-group-flush mb-3">
                {cartItems.map(item => (
                  <li key={item.producto.id} className="list-group-item bg-transparent text-white d-flex justify-content-between">
                    <span>
                      {item.producto.nombre} <small>(x{item.cantidad})</small>
                    </span>
                    <strong>{formatearPrecio(item.producto.precio * item.cantidad)}</strong>
                  </li>
                ))}
              </ul>
              <hr className="neon-divider" />
              <div className="d-flex justify-content-between fs-4 text-white">
                <strong>Total (CLP)</strong>
                <strong>{formatearPrecio(totalPedido)}</strong>
              </div>
              <div className="d-grid mt-4">
                <button type="submit" className="btn btn-gamer btn-lg">
                  Finalizar Compra
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};