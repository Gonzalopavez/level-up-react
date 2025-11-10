

/**
 * @function formatearPrecio
 * @description Toma un número y lo devuelve como string en formato CLP
 */
export const formatearPrecio = (precio: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(precio);
};