// src/services/orden-service.ts
import axios from 'axios';
import type { IOrden } from "../models/orden-model";

const API_URL = 'http://localhost:8080/api/ordenes';

export const getOrdenes = async (): Promise<IOrden[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error al leer las órdenes:", error);
    return [];
  }
};

export const guardarOrden = async (ordenReact: IOrden): Promise<boolean> => {
  try {

    // Transformación React → Java
    const itemsParaJava = ordenReact.items.map(item => ({
      cantidad: item.cantidad,
      precioUnitario: item.producto.precio,
      producto: { id: item.producto.id }
    }));

    const ordenParaJava = {
      fecha: ordenReact.fecha,
      total: ordenReact.total,
      cliente: { id: ordenReact.cliente.id },
      items: itemsParaJava
    };

    await axios.post(API_URL, ordenParaJava);
    return true;

  } catch (error) {
    console.error("Error al guardar la orden en Java:", error);
    return false;
  }
};
