// src/components/admin/GestionProductos.tsx

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import type { IProducto } from '../../models/producto-model';
import { formatearPrecio } from '../../utils/formatters';
import { 
  getProductos, 
  crearProducto, 
  actualizarProducto, 
  eliminarProducto 
} from '../../services/producto-service';

import { ProductoModal } from './productoModal';

// Molde para el formulario (usado como inicial)
const formularioVacio: Omit<IProducto, 'id'> = {
  nombre: '',
  precio: 0,
  categoria: 'Periféricos',
  descripcion: '',
  imagen: '',
  stock: 0
};

export const GestionProductos: React.FC = () => {
  const [productos, setProductos] = useState<IProducto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal control
  const [modalVisible, setModalVisible] = useState(false);
  const [productoInicial, setProductoInicial] = useState<Omit<IProducto, 'id'> | null>(null);
  const [productoEditandoId, setProductoEditandoId] = useState<number | null>(null);

  const cargarProductos = async () => {
    try {
      setIsLoading(true);
      const data = await getProductos();
      setProductos(data);
      setError(null);
    } catch (err) {
      setError("No se pudieron cargar los productos desde el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void cargarProductos();
  }, []);

  const abrirModalCrear = () => {
    setProductoEditandoId(null);
    setProductoInicial(formularioVacio);
    setModalVisible(true);
  };

  const abrirModalEditar = (p: IProducto) => {
    setProductoEditandoId(p.id || null);
    setProductoInicial({
      nombre: p.nombre,
      precio: p.precio,
      categoria: p.categoria,
      descripcion: p.descripcion,
      imagen: p.imagen,
      stock: p.stock
    });
    setModalVisible(true);
  };

  const handleEliminar = async (id: number) => {
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    });

    if (confirm.isConfirmed) {
      const exito = await eliminarProducto(id);
      if (exito) {
        await cargarProductos();
        Swal.fire('¡Eliminado!', 'El producto ha sido eliminado.', 'success');
      } else {
        Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
      }
    }
  };

  // onSave proviene del modal: recibe payload sin id
  const handleSaveFromModal = async (payload: Omit<IProducto, 'id'>) => {
    try {
      if (productoEditandoId) {
        const productoActualizado: IProducto = { ...payload, id: productoEditandoId };
        const ok = await actualizarProducto(productoActualizado);
        if (!ok) return false;
      } else {
        const ok = await crearProducto(payload);
        if (!ok) return false;
      }

      // success
      await cargarProductos();
      Swal.fire('¡Guardado!', 'El producto se ha guardado correctamente.', 'success');
      setModalVisible(false);
      setProductoInicial(null);
      setProductoEditandoId(null);
      return true;
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Hubo un error al guardar.', 'error');
      return false;
    }
  };

  if (isLoading) return <p className="text-center mt-5">Cargando productos...</p>;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-neon">Gestión de Productos</h3>
        <button className="btn btn-gamer" onClick={abrirModalCrear}>
          <i className="bi bi-plus-lg me-2"></i> Nuevo Producto
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-dark table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Imagen</th>
              <th>Nombre</th>
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
  src={
    producto.imagen?.startsWith('/')
      ? producto.imagen
      : producto.imagen || '/img/productos/no-image.png'
  }
  alt={producto.nombre}
  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
/>

                </td>
                <td>{producto.nombre}</td>
                <td>{producto.categoria}</td>
                <td className="text-success fw-bold">{formatearPrecio(producto.precio)}</td>
                <td>
                  <span className={`badge ${producto.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                    {producto.stock}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-info me-2" onClick={() => abrirModalEditar(producto)}>
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(producto.id)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal component */}
      <ProductoModal
        visible={modalVisible}
        initial={productoInicial}
        onClose={() => { setModalVisible(false); setProductoInicial(null); setProductoEditandoId(null); }}
        onSave={handleSaveFromModal}
      />
    </div>
  );
};
