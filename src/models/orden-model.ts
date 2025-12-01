// src/models/orden-model.ts

import type { ICartItem } from "../hooks/useCart";
import type { IUsuario } from "./usuario-model";

/**
 * @interface IOrden
 * Representa la orden que se envía a Java.
 */
export interface IOrden {
  id: number;
  fecha: string;
  cliente: IUsuario;
  items: ICartItem[];
  total: number; // totalFinal
}
