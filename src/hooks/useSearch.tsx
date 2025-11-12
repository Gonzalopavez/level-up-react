
import React, { createContext, useState, useContext, type ReactNode } from 'react';

// Definimos el "Molde" del Cerebro ---
interface SearchContextType {
  searchTerm: string; // El texto de búsqueda
  setSearchTerm: (term: string) => void; // La función para cambiarlo
}

//  Context --
const SearchContext = createContext<SearchContextType | undefined>(undefined);

//  "Proveedor" ---
interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {

  // "Memoria" del Cerebro:
  const [searchTerm, setSearchTerm] = useState(''); // Inicia vacío

  // "Valor" que proveemos
  const value = {
    searchTerm,
    setSearchTerm
  };

  // "Envolvemos" la aplicación
  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

//  El "Enchufe" (El Hook personalizado) ---
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch debe ser usado dentro de un SearchProvider');
  }
  return context;
};