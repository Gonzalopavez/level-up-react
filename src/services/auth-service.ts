// src/services/auth-service.ts
import type { IUsuario, ILoginCredentials } from "../models/usuario-model";

const USUARIOS_DB_URL = '/data/usuarios.json';
const LOCAL_STORAGE_KEY = 'usuarios';

// --- ¡¡AQUÍ ESTÁ EL MOLDE QUE FALTABA!! ---
// Este es el "molde" que el "Cerebro" (useAuth) estaba buscando
export interface LoginResult {
  ok: boolean;
  usuario: IUsuario | null;
  mensaje: string;
}

/**
 * @function login
 * @description Simula un inicio de sesión
 */
export const login = async (credentials: ILoginCredentials): Promise<LoginResult> => {
  try {
    // 1. Buscamos en el JSON (Base de datos simulada)
    const response = await fetch(USUARIOS_DB_URL);
    if (!response.ok) throw new Error("No se encontró usuarios.json");
    
    const usuariosSimulados: IUsuario[] = await response.json();
    const userSimulado = usuariosSimulados.find(
      u => u.correo === credentials.email && u.password === credentials.password
    );
    
    if (userSimulado) {
      return { ok: true, usuario: userSimulado, mensaje: 'Login exitoso (JSON)' };
    }

    // 2. Buscamos en localStorage (Usuarios registrados)
    const usuariosRegistrados: IUsuario[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const userRegistrado = usuariosRegistrados.find(
      u => u.correo === credentials.email && u.password === credentials.password
    );
    
    if (userRegistrado) {
      return { ok: true, usuario: userRegistrado, mensaje: 'Login exitoso (localStorage)' };
    }

    // 3. Si no se encuentra en ninguno
    return { ok: false, usuario: null, mensaje: 'Credenciales incorrectas' };

  } catch (error) {
    console.error("Error en auth.service:", error);
    return { ok: false, usuario: null, mensaje: 'Error al conectar con el servicio' };
  }
};

/**
 * @function register
 * (Esta función no cambia)
 */
export const register = (nuevoUsuario: IUsuario): { success: boolean, message: string } => {
  try {
    const usuarios: IUsuario[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    if (usuarios.some(u => u.correo === nuevoUsuario.correo)) {
      return { success: false, message: 'El correo electrónico ya está en uso.' };
    }
    usuarios.push(nuevoUsuario);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(usuarios));
    return { success: true, message: '¡Registro exitoso!' };
  } catch (error) {
    console.error("Error al guardar en localStorage:", error);
    return { success: false, message: 'Ocurrió un error al registrar.' };
  }
};