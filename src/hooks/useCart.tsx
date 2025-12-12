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
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe ser usado dentro de CartProvider");
  return ctx;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const LIMITE_MAXIMO = 999;

  const { currentUser } = useAuth();

  // Clave del carrito según el usuario (o vacío si es invitado)
  const getStorageKey = () => {
    if (currentUser) return `cartItems_user_${currentUser.id}`;
    return null; // invitados no tienen carrito persistente
  };

  // Cargar carrito cuando cambia usuario
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);

  useEffect(() => {
    const key = getStorageKey();

    if (!key) {
      // Invitado → carrito siempre vacío
      setCartItems([]);
      return;
    }

    // Usuario logueado → cargar su carrito personal
    const stored = localStorage.getItem(key);

    if (!stored) {
      setCartItems([]);
      return;
    }

    try {
      const parsed: ICartItem[] = JSON.parse(stored);

      // Sanitizar cantidades
      const safe = parsed.map(item => ({
        ...item,
        cantidad: Math.min(
          Number(item.cantidad) || 1,
          item.producto?.stock ?? 1,
          LIMITE_MAXIMO
        )
      }));

      setCartItems(safe);

    } catch {
      setCartItems([]);
    }

  }, [currentUser]);


  // Guardar carrito cuando cambia
  useEffect(() => {
    const key = getStorageKey();
    if (!key) return; // invitados no guardan carrito
    localStorage.setItem(key, JSON.stringify(cartItems));
  }, [cartItems, currentUser]);


  // Descuento DUOC
  const [descuentoActivo, setDescuentoActivo] = useState<boolean>(() => {
    return localStorage.getItem("descuentoActivo") === "true";
  });

  useEffect(() => {
    localStorage.setItem("descuentoActivo", descuentoActivo.toString());
  }, [descuentoActivo]);


  // Cálculos
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

  const totalFinal = useMemo(() => subTotal - descuento, [subTotal, descuento]);


  // Funciones del carrito
  const addToCart = (producto: IProducto) => {
    setCartItems(prev => {

      const item = prev.find(i => i.producto.id === producto.id);

      if (item) {
        return prev.map(i =>
          i.producto.id === producto.id
            ? { ...i, cantidad: Math.min(i.cantidad + 1, producto.stock, LIMITE_MAXIMO) }
            : i
        );
      }

      return [...prev, { producto, cantidad: 1 }];
    });
  };

  const decreaseQuantity = (id: number) => {
    setCartItems(prev => {
      const item = prev.find(i => i.producto.id === id);

      if (item && item.cantidad > 1) {
        return prev.map(i =>
          i.producto.id === id
            ? { ...i, cantidad: Math.max(1, i.cantidad - 1) }
            : i
        );
      }

      return prev.filter(i => i.producto.id !== id);
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(i => i.producto.id !== id));
  };

  const clearCart = () => setCartItems([]);


  return (
    <CartContext.Provider
      value={{
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
