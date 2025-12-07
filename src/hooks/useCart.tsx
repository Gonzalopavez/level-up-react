import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { IProducto } from '../models/producto-model';
import { useAuth } from './useAuth';

export interface ICartItem {
  producto: IProducto;
  cantidad: number;
}

export interface CartContextType {
  cartItems: ICartItem[];
  addToCart: (producto: IProducto) => void;
  removeFromCart: (productoId: number) => void;
  decreaseQuantity: (productoId: number) => void;
  clearCart: () => void;

  subTotal: number;
  descuento: number;
  totalFinal: number;
  descuentoActivo: boolean;
  setDescuentoActivo: (v: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // --- LIMITE DE SEGURIDAD GLOBAL ---  
  const LIMITE_MAXIMO = 999; // evita que agreguen 999999999 desde consola

  const [cartItems, setCartItems] = useState<ICartItem[]>(() => {
    try {
      const stored = localStorage.getItem('cartItems');
      if (!stored) return [];

      const parsed: ICartItem[] = JSON.parse(stored);

      // 🔥 SANITIZACIÓN: corregir cantidades inválidas o absurdas
      return parsed.map(item => ({
        ...item,
        cantidad: Math.min(
          Number(item.cantidad) || 1,
          item.producto?.stock ?? 1,
          LIMITE_MAXIMO
        )
      }));
    } catch {
      return [];
    }
  });

  const [descuentoActivo, setDescuentoActivo] = useState<boolean>(() => {
    return localStorage.getItem("descuentoActivo") === "true";
  });

  const { currentUser } = useAuth();

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("descuentoActivo", descuentoActivo.toString());
  }, [descuentoActivo]);

  const subTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const precio = Number(item.producto.precio) || 0;
      const cantidad = Number(item.cantidad) || 1;
      return total + precio * cantidad;
    }, 0);
  }, [cartItems]);

  const descuento = useMemo(() => {
    const esDuoc = currentUser?.correo?.toLowerCase().endsWith("@duoc.cl");
    if (!esDuoc) return 0;
    if (!descuentoActivo) return 0;

    return subTotal * 0.2;
  }, [subTotal, currentUser, descuentoActivo]);

  const totalFinal = useMemo(() => {
    return subTotal - descuento;
  }, [subTotal, descuento]);

  // ==========================================
  //        🛡️ FUNCIONES PROTEGIDAS
  // ==========================================

  const addToCart = (producto: IProducto) => {
    setCartItems(prev => {
      const encontrado = prev.find(i => i.producto.id === producto.id);

      if (encontrado) {
        const nuevaCantidad = Math.min(
          encontrado.cantidad + 1,
          producto.stock,
          LIMITE_MAXIMO
        );

        return prev.map(i =>
          i.producto.id === producto.id
            ? { ...i, cantidad: nuevaCantidad }
            : i
        );
      }

      return [...prev, { producto, cantidad: 1 }];
    });
  };

  const decreaseQuantity = (productoId: number) => {
    setCartItems(prev => {
      const item = prev.find(i => i.producto.id === productoId);

      if (item && item.cantidad > 1) {
        return prev.map(i =>
          i.producto.id === productoId
            ? { 
                ...i, 
                cantidad: Math.max(1, item.cantidad - 1)
              }
            : i
        );
      }

      return prev.filter(i => i.producto.id !== productoId);
    });
  };

  const removeFromCart = (productoId: number) => {
    setCartItems(prev => prev.filter(i => i.producto.id !== productoId));
  };

  const clearCart = () => setCartItems([]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    decreaseQuantity,
    clearCart,

    subTotal,
    descuento,
    totalFinal,
    descuentoActivo,
    setDescuentoActivo
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
