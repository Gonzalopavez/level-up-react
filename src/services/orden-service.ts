

import type { IOrden } from "../models/orden-model";

const ORDENES_KEY = 'ordenes'; // La "llave" de localStorage

/**
 * @function getOrdenes
 * @description Obtiene (lee) todas las órdenes guardadas en localStorage.
 * La hacemos 'async' para simular una llamada real a una base de datos.
 */
export const getOrdenes = async (): Promise<IOrden[]> => {
  try {
    const ordenesGuardadas = localStorage.getItem(ORDENES_KEY);
    if (!ordenesGuardadas) {
      return []; // Devuelve vacío si no hay nada
    }
    return JSON.parse(ordenesGuardadas) as IOrden[];
  } catch (error) {
    console.error("Error al leer las órdenes:", error);
    return [];
  }
};

/**
 * @function guardarOrden
 * @description Guarda una NUEVA orden en localStorage.
 */
export const guardarOrden = (nuevaOrden: IOrden): boolean => {
  try {
    // 1. Leemos las órdenes que ya existían
    const ordenes: IOrden[] = JSON.parse(localStorage.getItem(ORDENES_KEY) || '[]');
    
    // 2. Añadimos la nueva orden al listado
    ordenes.push(nuevaOrden);
    
    // 3. Guardamos el listado actualizado
    localStorage.setItem(ORDENES_KEY, JSON.stringify(ordenes));
    return true;

  } catch (error) {
    console.error("Error al guardar la orden:", error);
    return false;
  }
};