



//  Importamos el "molde"
import type { IProducto } from "../models/producto-model";

//  Definimos la ruta de nuestra API simulada (el archivo JSON)
const API_URL = '/data/productos.json'; 

/**
 * @function getProductos
 * @description Obtiene la lista completa de productos desde la "API" (archivo JSON).
 * Simula una llamada asíncrona.
 */
export const getProductos = async (): Promise<IProducto[]> => {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      // Si la respuesta no es exitosa (ej. 404 No encontrado)
      throw new Error('No se pudo cargar la lista de productos.');
    }

    const data: IProducto[] = await response.json();
    return data;

  } catch (error) {
    // Manejo de errores (ej. no se pudo conectar, el JSON está malformado)
    console.error("Error al obtener productos:", error);
    return []; // Devolvemos un array vacío en caso de error
  }
};

/**
 * @function getProductoById
 * @description Obtiene un solo producto por su ID.
 */
export const getProductoById = async (id: number): Promise<IProducto | undefined> => {
  try {
    // Para este ejemplo, traemos todos y filtramos.
    // Una API real permitiría pedir solo uno (ej. /api/productos/1)
    const productos = await getProductos();
    return productos.find(producto => producto.id === id);


    
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    return undefined;
  }
};