import React, { useState, useEffect } from 'react';
import type { IProducto } from '../../models/producto-model';
import { getProductos, actualizarStockYPrecio } from '../../services/producto-service';
import { formatearPrecio } from '../../utils/formatters';
import Swal from "sweetalert2";

export const GestionStockVendedor: React.FC = () => {

  const [productos, setProductos] = useState<IProducto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [productoSeleccionado, setProductoSeleccionado] = useState<IProducto | null>(null);
  const [nuevoStock, setNuevoStock] = useState("");
  const [nuevoPrecio, setNuevoPrecio] = useState("");

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
    setNuevoStock(producto.stock.toString());
    setNuevoPrecio(producto.precio.toString());

    const modal = new (window as any).bootstrap.Modal(document.getElementById('stockModal'));
    modal.show();
  };

  const handleNumericChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const valor = e.target.value;
    if (/^\d*$/.test(valor)) {
      setter(valor);
    }
  };

  const handleGuardarCambios = async () => {
    if (!productoSeleccionado) return;

    const stockFinal = Number(nuevoStock) || 0;
    const precioFinal = Number(nuevoPrecio) || 0;

    if (precioFinal <= 0) {
      Swal.fire("Error", "El precio debe ser mayor a 0.", "error");
      return;
    }

    // --- Guardar en backend ---
    const actualizado = await actualizarStockYPrecio(
      productoSeleccionado.id,
      precioFinal,
      stockFinal
    );

    if (!actualizado) {
      Swal.fire("Error", "No se pudo actualizar en la base de datos.", "error");
      return;
    }

    // --- Actualizar en tabla ---
    setProductos(prev =>
      prev.map(p =>
        p.id === productoSeleccionado.id
          ? { ...p, precio: precioFinal, stock: stockFinal }
          : p
      )
    );

    Swal.fire({
      icon: "success",
      title: "Cambios guardados",
      timer: 1500,
      showConfirmButton: false,
    });

    const modalEl = document.getElementById("stockModal");
    const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
    modal.hide();

    setProductoSeleccionado(null);
  };

  if (isLoading) return <p>Cargando productos...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <h3 className="text-neon mb-3">Gestión de Stock y Precios</h3>

      <div className="table-responsive">
        <table className="table table-dark table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(producto => (
              <tr key={producto.id}>
                <td>{producto.id}</td>
                <td>
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      marginRight: "10px",
                    }}
                  />
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

      {/* Modal */}
      <div className="modal fade" id="stockModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-dark text-white">
            <div className="modal-header border-secondary">
              <h5 className="modal-title">
                Modificar: {productoSeleccionado?.nombre}
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" />
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nuevo Precio (CLP)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  className="form-control"
                  value={nuevoPrecio}
                  onChange={(e) => handleNumericChange(e, setNuevoPrecio)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Nuevo Stock</label>
                <input
                  type="text"
                  inputMode="numeric"
                  className="form-control"
                  value={nuevoStock}
                  onChange={(e) => handleNumericChange(e, setNuevoStock)}
                />
              </div>
            </div>

            <div className="modal-footer border-secondary">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button className="btn btn-gamer" onClick={handleGuardarCambios}>Guardar</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
