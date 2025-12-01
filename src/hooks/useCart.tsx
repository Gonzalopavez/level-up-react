import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { IProducto } from '../models/producto-model';
import { useAuth } from './useAuth';

// Molde de un item del carrito
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

// Contexto
const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const [cartItems, setCartItems] = useState<ICartItem[]>(() => {
    try {
      const stored = localStorage.getItem('cartItems');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [descuentoActivo, setDescuentoActivo] = useState<boolean>(() => {
    return localStorage.getItem("descuentoActivo") === "true";
  });

  const { currentUser } = useAuth();

  // Guardar carrito
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Guardar interruptor descuento
  useEffect(() => {
    localStorage.setItem("descuentoActivo", descuentoActivo.toString());
  }, [descuentoActivo]);

  // --- CALCULO SUBTOTAL ---
  const subTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const precio = Number(item.producto.precio) || 0;
      const cantidad = Number(item.cantidad) || 1;
      return total + precio * cantidad;
    }, 0);
  }, [cartItems]);

  // --- DESCUENTO ---
  const descuento = useMemo(() => {
    const esDuoc = currentUser?.correo?.toLowerCase().endsWith("@duoc.cl");

    if (!esDuoc) return 0;
    if (!descuentoActivo) return 0;

    return subTotal * 0.2;
  }, [subTotal, currentUser, descuentoActivo]);

  // --- TOTAL FINAL ---
  const totalFinal = useMemo(() => {
    return subTotal - descuento;
  }, [subTotal, descuento]);

  // --- CRUD CARRITO ---
  const addToCart = (producto: IProducto) => {
    setCartItems(prev => {
      const item = prev.find(i => i.producto.id === producto.id);
      if (item) {
        return prev.map(i =>
          i.producto.id === producto.id
            ? { ...i, cantidad: i.cantidad + 1 }
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
            ? { ...i, cantidad: i.cantidad - 1 }
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

  // Exponemos todo
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
