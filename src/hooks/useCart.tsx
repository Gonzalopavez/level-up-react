

// src/hooks/useCart.tsx
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { IProducto } from '../models/producto-model';

// 1. Define el "molde" de un item en el carrito
export interface ICartItem {
  producto: IProducto;
  cantidad: number;
}

// 2. Define el "molde" de lo que el "cerebro" va a compartir
export interface CartContextType {
  cartItems: ICartItem[];
  addToCart: (producto: IProducto) => void;
  removeFromCart: (productoId: number) => void;
  decreaseQuantity: (productoId: number) => void;
  clearCart: () => void;
  totalPedido: number; // <-- ¡AQUÍ ESTÁ EL CAMBIO!
}

// 3. Crea el "túnel" (Context)
const CartContext = createContext<CartContextType | undefined>(undefined);

// 4. Crea el "enchufe" (Hook)
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

// 5. Crea el "Tablero Eléctrico" (Provider)
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  // "Memoria" para guardar los items
  const [cartItems, setCartItems] = useState<ICartItem[]>(() => {
    // Carga inicial desde localStorage
    try {
      const storedItems = localStorage.getItem('cartItems');
      return storedItems ? JSON.parse(storedItems) : [];
    } catch (error) {
      console.error("Error al cargar carrito de localStorage", error);
      return [];
    }
  });

  // "Efecto" que guarda en localStorage CADA VEZ que cartItems cambia
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // --- ¡AQUÍ ESTÁ LA NUEVA LÓGICA! ---
  // Calculamos el total.
  // 'useMemo' es un "truco" de React para que este cálculo
  // solo se ejecute si 'cartItems' cambia (es más eficiente).
  const totalPedido = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + (item.producto.precio * item.cantidad);
    }, 0);
  }, [cartItems]); // <-- Se recalcula solo si cartItems cambia

  
  // --- Funciones (no cambian) ---
  const addToCart = (producto: IProducto) => {
    setCartItems(prevItems => {
      const itemExistente = prevItems.find(item => item.producto.id === producto.id);
      if (itemExistente) {
        return prevItems.map(item =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prevItems, { producto, cantidad: 1 }];
    });
  };

  const decreaseQuantity = (productoId: number) => {
    setCartItems(prevItems => {
      const itemExistente = prevItems.find(item => item.producto.id === productoId);
      if (itemExistente && itemExistente.cantidad > 1) {
        return prevItems.map(item =>
          item.producto.id === productoId
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        );
      }
      // Si la cantidad es 1, lo elimina
      return prevItems.filter(item => item.producto.id !== productoId);
    });
  };

  const removeFromCart = (productoId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.producto.id !== productoId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // 6. Define el "valor" que el "Tablero" va a compartir
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    decreaseQuantity,
    clearCart,
    totalPedido // <-- ¡AÑADIMOS EL TOTAL AL "VALOR"!
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};