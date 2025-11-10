/// src/components/vendedor/GestionStockVendedor.tsx
import React, { useState, useEffect } from 'react';
import type { IProducto } from '../../models/producto-model';
import { getProductos } from '../../services/producto-service';
import { formatearPrecio } from '../../utils/formatters';

export const GestionStockVendedor: React.FC = () => {
  
  const [productos, setProductos] = useState<IProducto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [productoSeleccionado, setProductoSeleccionado] = useState<IProducto | null>(null);
  
  // --- CAMBIO 1: El estado ahora guarda STRINGS ---
  // Esto permite que el input esté vacío ("") en lugar de forzar un 0
  const [nuevoStock, setNuevoStock] = useState("0");
  const [nuevoPrecio, setNuevoPrecio] = useState("0");

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setIsLoading(true);
        const data = await getProductos();
        setProductos(data);
        setError(null);
      } catch (err) {
        setError("No se pudieron cargar los productos.");
      } finally {
        setIsLoading(false);
      }
    };
    cargarProductos();
  }, []);

  const handleAbrirModal = (producto: IProducto) => {
    setProductoSeleccionado(producto);
    
    // --- CAMBIO 2: Convertimos los números a STRING al abrir ---
    setNuevoStock(producto.stock.toString());
    setNuevoPrecio(producto.precio.toString());
    
    const modal = new (window as any).bootstrap.Modal(document.getElementById('stockModal'));
    modal.show();
  };

  const handleGuardarCambios = () => {
    if (!productoSeleccionado) return;

    // --- CAMBIO 3: Convertimos los STRINGS a NÚMERO al guardar ---
    // Usamos '|| 0' por si el vendedor dejó el campo vacío (string vacío)
    const stockFinal = Number(nuevoStock) || 0;
    const precioFinal = Number(nuevoPrecio) || 0;

    setProductos(prevProductos => 
      prevProductos.map(p => 
        p.id === productoSeleccionado.id 
          ? { ...p, stock: stockFinal, precio: precioFinal } 
          : p
      )
    );

    const modalElement = document.getElementById('stockModal');
    const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
    modal.hide();
    
    setProductoSeleccionado(null);
  };

  // --- CAMBIO 4: Nueva función "inteligente" para el onChange ---
  // Esta función solo permite dígitos (0-9) y el string vacío
  // Bloquea letras, puntos, y el signo "-" (negativo)
  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const valor = e.target.value;
    
    // Regex: /^\d*$/  (Solo permite dígitos o un string vacío)
    if (/^\d*$/.test(valor)) {
      setter(valor);
    }
  };

  if (isLoading) return <p>Cargando productos...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <h3 className="text-neon mb-3">Gestión de Stock y Precios</h3>
      
      {/* ... (La tabla no cambia) ... */}
      <div className="table-responsive">
        <table className="table table-dark table-striped table-hover">
          {/* ... (thead no cambia) ... */}
          <thead>
             <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio Actual</th>
              <th>Stock Actual</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(producto => (
              <tr key={producto.id}>
                <td>{producto.id}</td>
                <td>
                  <img src={producto.imagen} alt={producto.nombre} style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }} />
                  {producto.nombre}
                </td>
                <td>{producto.categoria}</td>
                <td className="text-success fw-bold">{formatearPrecio(producto.precio)}</td>
                <td className="fw-bold">{producto.stock}</td>
                <td>
                  <button 
                    className="btn btn-gamer"
                    onClick={() => handleAbrirModal(producto)}
                  >
                    Modificar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Modal para Modificar Stock/Precio --- */}
      <div className="modal fade" id="stockModal" tabIndex={-1} aria-labelledby="stockModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-dark text-white">
            <div className="modal-header border-secondary">
              <h5 className="modal-title" id="stockModalLabel">
                Modificar: {productoSeleccionado?.nombre}
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              
              {/* --- INPUTS CORREGIDOS --- */}
              <div className="mb-3">
                <label htmlFor="nuevoPrecio" className="form-label">Nuevo Precio (CLP)</label>
                <input 
                  type="text" // <-- Cambiado de 'number' a 'text' (elimina flechas)
                  inputMode="numeric" // <-- Muestra teclado numérico en móviles
                  className="form-control" 
                  id="nuevoPrecio"
                  value={nuevoPrecio}
                  onChange={(e) => handleNumericChange(e, setNuevoPrecio)} // <-- Usa el handler "inteligente"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="nuevoStock" className="form-label">Nuevo Stock (Unidades)</label>
                <input 
                  type="text" // <-- Cambiado de 'number' a 'text' (elimina flechas)
                  inputMode="numeric" // <-- Muestra teclado numérico en móviles
                  className="form-control" 
                  id="nuevoStock"
                  value={nuevoStock}
                  onChange={(e) => handleNumericChange(e, setNuevoStock)} // <-- Usa el handler "inteligente"
                />
              </div>
            </div>
            <div className="modal-footer border-secondary">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button 
                type="button" 
                className="btn btn-gamer"
                onClick={handleGuardarCambios}
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};