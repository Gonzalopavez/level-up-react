// src/hooks/useSearch.tsx

import React, { createContext, useState, useContext, type ReactNode } from 'react';

// --- 1. Definimos el "Molde" del Cerebro ---
interface SearchContextType {
  searchTerm: string; // El texto de búsqueda
  setSearchTerm: (term: string) => void; // La función para cambiarlo
}

// --- 2. Creamos el Context (El "Tablero Eléctrico") ---
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// --- 3. Creamos el "Proveedor" ---
interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {

  // 4. La "Memoria" del Cerebro:
  const [searchTerm, setSearchTerm] = useState(''); // Inicia vacío

  // 5. El "Valor" que proveemos
  const value = {
    searchTerm,
    setSearchTerm
  };

  // 6. "Envolvemos" la aplicación
  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

// --- 7. El "Enchufe" (El Hook personalizado) ---
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch debe ser usado dentro de un SearchProvider');
  }
  return context;
};