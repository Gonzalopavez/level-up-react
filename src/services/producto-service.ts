// src/services/producto-service.ts
import axios from 'axios';
import type { IProducto } from '../models/producto-model';

// La URL de tu Backend Java
const API_URL = 'http://localhost:8080/api/productos';

// 1. Obtener todos los productos
export const getProductos = async (): Promise<IProducto[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // Axios ya nos da el JSON listo en .data
  } catch (error) {
    console.error("Error al conectar con el Backend:", error);
    return [];
  }
};

// 2. Obtener un producto por ID
export const getProductoById = async (id: number): Promise<IProducto | null> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return null;
  }
};

// 3. Crear un producto NUEVO
export const crearProducto = async (producto: Omit<IProducto, 'id'>): Promise<IProducto | null> => {
  try {
    const response = await axios.post(API_URL, producto);
    return response.data;
  } catch (error) {
    console.error("Error al crear producto:", error);
    return null;
  }
};

// 4. Actualizar un producto existente
export const actualizarProducto = async (producto: IProducto): Promise<IProducto | null> => {
  try {
    // Spring Boot espera el ID en la URL para el PUT: /api/productos/1
    const response = await axios.put(`${API_URL}/${producto.id}`, producto);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return null;
  }
};

// 4.1 Actualizar SOLO precio y stock (para vendedor)
export const actualizarStockYPrecio = async (
  id: number,
  precio: number,
  stock: number
): Promise<IProducto | null> => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/stock-precio`, {
      precio,
      stock
    });

    return response.data;
  } catch (error) {
    console.error("Error al actualizar stock/precio:", error);
    return null;
  }
};

// 5. Eliminar un producto
export const eliminarProducto = async (id: number): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return true;
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return false;
  }
};