

import React, { useState, useEffect } from 'react';
import type { IOrden } from '../../models/orden-model';
import { getOrdenes } from '../../services/orden-service'; 
import { formatearPrecio } from '../../utils/formatters';

export const VerVentas: React.FC = () => {

  // --- Estados (Memoria) ---
  const [ordenes, setOrdenes] = useState<IOrden[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Memoria para el modal (para ver el detalle)
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<IOrden | null>(null);

  // --- Carga de Datos ---
  useEffect(() => {
    const cargarOrdenes = async () => {
      try {
        setIsLoading(true);
        // 1. Llamamos al "Camarero"
        const data = await getOrdenes();
        // 2. Guardamos las órdenes en la memoria
        setOrdenes(data.reverse()); // .reverse() para mostrar las más nuevas primero
        setError(null);
      } catch (err) {
        setError("No se pudieron cargar las órdenes.");
      } finally {
        setIsLoading(false);
      }
    };
    cargarOrdenes();
  }, []); // El [] significa: "ejecútalo solo una vez al cargar"

  // --- Funciones del Modal ---
  const handleAbrirModal = (orden: IOrden) => {
    setOrdenSeleccionada(orden);
    const modal = new (window as any).bootstrap.Modal(document.getElementById('detalleVentaModal'));
    modal.show();
  };

  // --- Renderizado ---
  if (isLoading) return <p>Cargando historial de ventas...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <h3 className="text-neon mb-3">Historial de Ventas</h3>

      {ordenes.length === 0 ? (
        <p>Aún no se han registrado ventas.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-striped table-hover">
            <thead>
              <tr>
                <th>ID Orden</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Items</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map(orden => (
                <tr key={orden.id}>
                  <td>{orden.id}</td>
                  <td>{orden.fecha}</td>
                  <td>{orden.cliente.nombre} {orden.cliente.apellidos}</td>
                  <td className="text-success fw-bold">{formatearPrecio(orden.total)}</td>
                  <td>{orden.items.length}</td>
                  <td>
                    <button 
                      className="btn btn-gamer btn-sm"
                      onClick={() => handleAbrirModal(orden)}
                    >
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- Modal para Ver Detalle de la Venta --- */}
      {/* (Usamos 'ordenSeleccionada' para llenar los datos) */}
      <div className="modal fade" id="detalleVentaModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content bg-dark text-white">
            <div className="modal-header border-secondary">
              <h5 className="modal-title">
                Detalle Orden: {ordenSeleccionada?.id}
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {ordenSeleccionada ? (
                <>
                  <p><strong>Cliente:</strong> {ordenSeleccionada.cliente.nombre} ({ordenSeleccionada.cliente.correo})</p>
                  <p><strong>Fecha:</strong> {ordenSeleccionada.fecha}</p>
                  <p><strong>Total Pagado:</strong> <span className="text-success fw-bold">{formatearPrecio(ordenSeleccionada.total)}</span></p>
                  <hr/>
                  <h6 className="text-neon">Items Comprados:</h6>
                  <ul className="list-group list-group-flush">
                    {ordenSeleccionada.items.map(item => (
                      <li key={item.producto.id} className="list-group-item bg-transparent text-white d-flex justify-content-between">
                        <span>
                          {item.producto.nombre} <small>(x{item.cantidad})</small>
                        </span>
                        <strong>{formatearPrecio(item.producto.precio * item.cantidad)}</strong>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>Cargando detalle...</p>
              )}
            </div>
            <div className="modal-footer border-secondary">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
      {/* --- Fin del Modal --- */}
      
    </div>
  );
};