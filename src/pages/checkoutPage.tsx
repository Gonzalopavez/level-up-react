// src/pages/CheckoutPage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { formatearPrecio } from '../utils/formatters';

import { guardarOrden } from '../services/orden-service';
import type { IOrden } from '../models/orden-model';

const regionesYComunas = [
  { nombre: "Región Metropolitana", comunas: ["Santiago", "Providencia", "Las Condes"] },
  { nombre: "Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Quilpué"] },
  { nombre: "Biobío", comunas: ["Concepción", "Talcahuano", "San Pedro de la Paz"] },
];

export const CheckoutPage: React.FC = () => {

  const { currentUser } = useAuth();
  const { cartItems, subTotal, descuento, totalFinal, descuentoActivo, setDescuentoActivo, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '', apellidos: '', direccion: '', region: '', comuna: '', metodoPago: 'debito'
  });

  const [comunas, setComunas] = useState<string[]>([]);

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        nombre: currentUser.nombre,
        apellidos: currentUser.apellidos
      }));
    }
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const region = e.target.value;
    setFormData(prev => ({ ...prev, region, comuna: '' }));
    const found = regionesYComunas.find(r => r.nombre === region);
    setComunas(found ? found.comunas : []);
  };

  // === GUARDAR ORDEN ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      Swal.fire('Error', 'Debes iniciar sesión para comprar.', 'error');
      return;
    }

    const nuevaOrden: IOrden = {
      id: Date.now(),
      fecha: new Date().toLocaleString('es-CL'),
      cliente: currentUser,
      items: cartItems,
      total: totalFinal // <-- EL ÚNICO valor que Java acepta
    };

    const exito = await guardarOrden(nuevaOrden);

    if (exito) {
      Swal.fire({
        title: '¡Compra Exitosa!',
        text: 'Tu pedido ha sido procesado.',
        icon: 'success',
        timer: 2500,
        timerProgressBar: true
      }).then(() => {
        clearCart();
        navigate('/');
      });
    } else {
      Swal.fire('Error', 'No se pudo guardar tu orden.', 'error');
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h1 className="text-neon mb-4">Finalizar Compra</h1>

      <form onSubmit={handleSubmit}>
        <div className="row">

          {/* FORMULARIO */}
          <div className="col-lg-7">
            <div className="checkout-container p-4 mb-4">
              <h3 className="text-white mb-3">Dirección de Envío</h3>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Nombre</label>
                  <input className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Apellidos</label>
                  <input className="form-control" name="apellidos" value={formData.apellidos} onChange={handleChange} required />
                </div>
              </div>

              <div className="mb-3">
                <label>Dirección</label>
                <input className="form-control" name="direccion" value={formData.direccion} onChange={handleChange} required />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Región</label>
                  <select className="form-select" name="region" value={formData.region} onChange={handleRegionChange} required>
                    <option value="">Seleccionar...</option>
                    {regionesYComunas.map(r => <option key={r.nombre} value={r.nombre}>{r.nombre}</option>)}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label>Comuna</label>
                  <select className="form-select" name="comuna" value={formData.comuna} disabled={!comunas.length} onChange={handleChange} required>
                    <option value="">Seleccionar...</option>
                    {comunas.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="checkout-container p-4">
              <h3 className="text-white mb-3">Método de Pago</h3>

              <div className="form-check mb-2">
                <input type="radio" className="form-check-input" name="metodoPago" value="debito" checked={formData.metodoPago === 'debito'} onChange={handleChange} />
                <label className="form-check-label">Tarjeta de Débito</label>
              </div>

              <div className="form-check">
                <input type="radio" className="form-check-input" name="metodoPago" value="credito" checked={formData.metodoPago === 'credito'} onChange={handleChange} />
                <label className="form-check-label">Tarjeta de Crédito</label>
              </div>

            </div>
          </div>

          {/* RESUMEN */}
          <div className="col-lg-5">
            <div className="checkout-container p-4">

              <h3 className="text-white mb-3">Resumen del Pedido</h3>

              <ul className="list-group list-group-flush mb-3">
                {cartItems.map(item => (
                  <li key={item.producto.id} className="list-group-item bg-transparent text-white d-flex justify-content-between">
                    <span>{item.producto.nombre} (x{item.cantidad})</span>
                    <strong>{formatearPrecio(item.producto.precio * item.cantidad)}</strong>
                  </li>
                ))}
              </ul>

              {/* Interruptor descuento */}
              {currentUser?.correo.toLowerCase().endsWith("@duoc.cl") && (
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={descuentoActivo}
                    onChange={e => setDescuentoActivo(e.target.checked)}
                  />
                  <label className="form-check-label text-white">
                    Aplicar descuento 20% DUOC
                  </label>
                </div>
              )}

              <hr className="neon-divider" />

              <p className="d-flex justify-content-between text-white">
                <span>Subtotal:</span>
                <strong>{formatearPrecio(subTotal)}</strong>
              </p>

              <p className="d-flex justify-content-between text-warning">
                <span>Descuento:</span>
                <strong>- {formatearPrecio(descuento)}</strong>
              </p>

              <p className="d-flex justify-content-between fs-4 text-success">
                <span>Total Final:</span>
                <strong>{formatearPrecio(totalFinal)}</strong>
              </p>

              <div className="d-grid mt-4">
                <button type="submit" className="btn btn-gamer btn-lg">Finalizar Compra</button>
              </div>

            </div>
          </div>

        </div>
      </form>
    </div>
  );
};
