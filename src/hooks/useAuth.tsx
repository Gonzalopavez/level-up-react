// src/hooks/useAuth.tsx
import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import type { IUsuario, ILoginCredentials } from "../models/usuario-model";

// --- ¡¡ARREGLO 1!! ---
// Importamos el "molde" Y la función (con un alias)
import { 
  login as loginService, // <-- Importamos la función como "loginService"
  type LoginResult        // <-- Importamos el "molde"
} from '../services/auth-service';

// "Molde" del Cerebro
interface AuthContextType {
  currentUser: IUsuario | null;
  // --- ¡¡ARREGLO 2!! ---
  // La función login ahora espera UN objeto (credentials)
  login: (credentials: ILoginCredentials) => Promise<LoginResult>; 
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  
  const [currentUser, setCurrentUser] = useState<IUsuario | null>(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('currentUser');
    if (usuarioGuardado) {
      setCurrentUser(JSON.parse(usuarioGuardado));
    }
  }, []);

  // La Lógica: Función de Login
  const login = async (credentials: ILoginCredentials): Promise<LoginResult> => {
    
    // --- ¡¡ARREGLO 3!! ---
    // Llamamos a la función "loginService" que importamos
    const result = await loginService(credentials);

    if (result.ok && result.usuario) {
      setCurrentUser(result.usuario);
      localStorage.setItem('currentUser', JSON.stringify(result.usuario));
    }
    
    return result; // Devuelve el objeto { ok, usuario, mensaje }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// El "Enchufe" (no cambia)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};