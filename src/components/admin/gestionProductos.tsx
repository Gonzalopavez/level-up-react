

import React, { useState, useEffect } from 'react';
import type { IProducto } from '../../models/producto-model';
import { getProductos } from '../../services/producto-service';
import { formatearPrecio } from '../../utils/formatters';

// Molde para el formulario (un producto sin ID, ya que el ID se asigna al crear)
const formularioVacio: Omit<IProducto, 'id'> = {
  nombre: '',
  precio: 0,
  categoria: 'Periféricos', // Valor por defecto
  descripcion: '',
  imagen: '', // (En un CRUD real, esto sería un 'file input')
  stock: 0
};



export const GestionProductos: React.FC = () => {
  
  // --- ESTADOS (MEMORIA) ---
  const [productos, setProductos] = useState<IProducto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para el formulario del modal
  const [formData, setFormData] = useState(formularioVacio);
  
  // Estado para saber si estamos "Editando" o "Creando"
  // Si contiene un producto, estamos "Editando".
  // Si es 'null', estamos "Creando".
  const [productoAEditar, setProductoAEditar] = useState<IProducto | null>(null);




  // --- EFECTOS ---
  // Carga los productos del JSON al iniciar
  useEffect(() => {
    const cargarProductos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getProductos();
        setProductos(data);
      } catch (err) {
        setError("Error al cargar los productos. Intente de nuevo.");
      } finally {
        setIsLoading(false);
      }
    };
    cargarProductos();
  }, []);



  // --- LÓGICA DE CRUD (SIMULADA) ---

  // R (READ): Ya está hecho con el useEffect y el .map() de la tabla.

  // C (CREATE): Prepara el modal para "Crear"

  const handleOpenCreateModal = () => {
    setFormData(formularioVacio); // Resetea el formulario
    setProductoAEditar(null); // Pone el modo en "Crear"
  };



  // U (UPDATE): Prepara el modal para "Editar"
  const handleOpenEditModal = (producto: IProducto) => {
    setFormData(producto); // Llena el formulario con los datos del producto
    setProductoAEditar(producto); // Pone el modo en "Editar"
  };


  
  // D (DELETE): Elimina de la "memoria"
  const handleDelete = (productoId: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      setProductos(prev => prev.filter(p => p.id !== productoId));
      console.log(`(Simulado) Producto ${productoId} eliminado.`);
    }
  };

  // Función para manejar los cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Si es un número (precio, stock), conviértelo a número
    const valor = type === 'number' ? parseFloat(value) : value;

    setFormData(prev => ({
      ...prev,
      [name]: valor,
    }));
  };

  // Función para guardar (Crear o Actualizar)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue

    if (productoAEditar) {
      // --- LÓGICA DE ACTUALIZAR (UPDATE) ---
      // Reemplaza el producto viejo por el 'formData' en la lista
      setProductos(prev => 
        prev.map(p => (p.id === productoAEditar.id ? { ...formData, id: p.id } : p))
      );
      console.log(`(Simulado) Producto ${productoAEditar.id} actualizado.`);
      
    } else {
      // --- LÓGICA DE CREAR (CREATE) ---
      // Añade el 'formData' como un nuevo producto
      // (Simulamos un ID nuevo con la fecha)
      const nuevoProducto: IProducto = { ...formData, id: Date.now() };
      setProductos(prev => [...prev, nuevoProducto]);
      console.log(`(Simulado) Producto nuevo creado.`);
    }

    // (Aquí cerraremos el modal, pero Bootstrap se encarga con 'data-bs-dismiss')
  };

  // --- RENDERIZADO ---
  if (isLoading) {
    return <div className="text-center"><div className="spinner-border" role="status"></div></div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      {/* 1. Botón de Agregar (Ahora vive aquí) */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fs-4 mb-0">Gestión de Productos</h3>
        <button 
          className="btn btn-primary btn-neon"
          data-bs-toggle="modal"        // <-- Atributo de Bootstrap
          data-bs-target="#formProductoModal" // <-- Apunta al ID del modal
          onClick={handleOpenCreateModal} // <-- Llama a la función "Crear"
        >
          <i className="bi bi-plus-circle-fill me-2"></i>
          Agregar Nuevo Producto
        </button>
      </div>
      
      {/* 2. La Tabla (READ y DELETE) */}
      <div className="table-responsive">
        <table className="table table-dark table-striped table-hover">
          <thead>
            <tr>
              {/* ... (encabezados de la tabla) ... */}
              <th scope="col">ID</th>
              <th scope="col">Imagen</th>
              <th scope="col">Nombre</th>
              <th scope="col">Categoría</th>
              <th scope="col">Precio</th>
              <th scope="col">Stock</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id}>
                <th scope="row">{p.id}</th>
                <td><img src={p.imagen} alt={p.nombre} style={{ width: '50px', height: '50px', objectFit: 'cover' }} /></td>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>{formatearPrecio(p.precio)}</td>
                <td>{p.stock}</td>
                <td>
                  <button 
                    className="btn btn-warning btn-sm me-2"
                    data-bs-toggle="modal"        // <-- Atributo de Bootstrap
                    data-bs-target="#formProductoModal" // <-- Apunta al MISMO ID
                    onClick={() => handleOpenEditModal(p)} // <-- Llama a la función "Editar"
                  >
                    <i className="bi bi-pencil-fill"></i> Editar
                  </button>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(p.id)}
                  >
                    <i className="bi bi-trash-fill"></i> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. El Modal (CREATE y UPDATE) */}
      {/* (Vive aquí, pero está invisible hasta que se le llama) */}
      <div className="modal fade" id="formProductoModal" tabIndex={-1} aria-labelledby="formProductoModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content bg-dark text-white">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title" id="formProductoModalLabel">
                  {/* Título dinámico: cambia si estamos creando o editando */}
                  {productoAEditar ? 'Editar Producto' : 'Agregar Nuevo Producto'}
                </h5>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {/* El Formulario */}
                
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre del Producto</label>
                  <input type="text" className="form-control" id="nombre" name="nombre"
                         value={formData.nombre} onChange={handleChange} required />
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="precio" className="form-label">Precio</label>
                    <input type="number" className="form-control" id="precio" name="precio"
                           value={formData.precio} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="stock" className="form-label">Stock</label>
                    <input type="number" className="form-control" id="stock" name="stock"
                           value={formData.stock} onChange={handleChange} required />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="categoria" className="form-label">Categoría</label>
                  <select className="form-select" id="categoria" name="categoria"
                          value={formData.categoria} onChange={handleChange} required>
                    <option value="Periféricos">Periféricos</option>
                    <option value="Monitores">Monitores</option>
                    <option value="Componentes">Componentes</option>
                    <option value="Audio">Audio</option>
                    {/* (Añadir más categorías si las tienes) */}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="imagen" className="form-label">URL de la Imagen</label>
                  <input type="text" className="form-control" id="imagen" name="imagen"
                         placeholder="Ej: /img/productos/nuevo-mouse.jpg"
                         value={formData.imagen} onChange={handleChange} />
                  <small className="form-text">Debe ser una ruta local (ej: /img/...) o una URL (http://...).</small>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="descripcion" className="form-label">Descripción</label>
                  <textarea className="form-control" id="descripcion" name="descripcion" rows={3}
                            value={formData.descripcion} onChange={handleChange}></textarea>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="submit" className="btn btn-primary btn-neon" data-bs-dismiss="modal">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};