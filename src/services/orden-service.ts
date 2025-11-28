// src/services/orden-service.ts
import axios from 'axios';
import type { IOrden } from "../models/orden-model";

const API_URL = 'http://localhost:8080/api/ordenes';

/**
 * @function getOrdenes
 * Obtiene las órdenes desde Java
 */
export const getOrdenes = async (): Promise<IOrden[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error al leer las órdenes:", error);
    return [];
  }
};

/**
 * @function guardarOrden
 * Envía la orden a Java.
 * IMPORTANTE: Transformamos los datos para que coincidan con lo que Java espera.
 */
export const guardarOrden = async (ordenReact: IOrden): Promise<boolean> => {
  try {
    
    // Transformación: React CartItem -> Java DetalleOrden
    const itemsParaJava = ordenReact.items.map(item => ({
      cantidad: item.cantidad,
      precioUnitario: item.producto.precio,
      producto: { id: item.producto.id } // Enviamos solo el ID del producto
    }));

    // Armamos el objeto final para Java
    const ordenParaJava = {
      fecha: ordenReact.fecha,
      total: ordenReact.total,
      cliente: { id: ordenReact.cliente.id }, // Enviamos solo el ID del usuario
      items: itemsParaJava
    };

    await axios.post(API_URL, ordenParaJava);
    return true;

  } catch (error) {
    console.error("Error al guardar la orden en Java:", error);
    return false;
  }
};