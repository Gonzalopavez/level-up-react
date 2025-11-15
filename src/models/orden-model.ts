
import type { ICartItem } from "../hooks/useCart";
import type { IUsuario } from "./usuario-model";

/**
 * @interface IOrden
 * @description El "molde" de una orden de compra completada.
 */
export interface IOrden {
  id: number; // timestamp (la fecha en milisegundos)
  fecha: string; // La fecha legible (ej: "14/11/2025 17:30")
  cliente: IUsuario; // El usuario que compró
  items: ICartItem[]; // La lista de productos
  total: number; // El total pagado
}