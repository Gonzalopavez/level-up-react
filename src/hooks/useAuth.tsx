import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import type { IUsuario, ILoginCredentials } from "../models/usuario-model";
import { 
  login as loginService,
  type LoginResult
} from '../services/auth-service';

interface AuthContextType {
  currentUser: IUsuario | null;
  login: (credentials: ILoginCredentials) => Promise<LoginResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

  const [currentUser, setCurrentUser] = useState<IUsuario | null>(null);

  // Al cargar la página: restaurar usuario
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('currentUser');
    if (usuarioGuardado) {
      setCurrentUser(JSON.parse(usuarioGuardado));
    }
  }, []);

  // LOGIN
  const login = async (credentials: ILoginCredentials): Promise<LoginResult> => {
    const result = await loginService(credentials);

    if (result.ok && result.usuario) {

      // Restaurar usuario actual
      setCurrentUser(result.usuario);
      localStorage.setItem('currentUser', JSON.stringify(result.usuario));
    }

    return result;
  };

  // LOGOUT (🔥 también vacía carrito)
  const logout = () => {

    if (currentUser) {
      // Borrar el carrito del usuario que se va
      localStorage.removeItem(`cartItems_user_${currentUser.id}`);
    }

    // Borrar usuario
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe ser usado dentro de AuthProvider');
  return ctx;
};
