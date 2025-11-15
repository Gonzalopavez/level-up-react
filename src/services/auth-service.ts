
import type { IUsuario, ILoginCredentials } from "../models/usuario-model";

const USUARIOS_DB_URL = '/data/usuarios.json';
const LOCAL_STORAGE_KEY = 'usuarios';

// Molde del resultado del login
export interface LoginResult {
  ok: boolean;
  usuario: IUsuario | null;
  mensaje: string;
}

/**
 * @function login
 * 
 */
export const login = async (credentials: ILoginCredentials): Promise<LoginResult> => {
  try {
    // 1. Buscamos en el JSON
    const response = await fetch(USUARIOS_DB_URL);
    if (!response.ok) throw new Error("No se encontró usuarios.json");
    
    const usuariosSimulados: IUsuario[] = await response.json();
    const userSimulado = usuariosSimulados.find(
      u => u.correo === credentials.email && u.password === credentials.password
    );
    if (userSimulado) {
      return { ok: true, usuario: userSimulado, mensaje: 'Login exitoso (JSON)' };
    }

    // 2. Buscamos en localStorage
    const usuariosRegistrados: IUsuario[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const userRegistrado = usuariosRegistrados.find(
      u => u.correo === credentials.email && u.password === credentials.password
    );
    if (userRegistrado) {
      return { ok: true, usuario: userRegistrado, mensaje: 'Login exitoso (localStorage)' };
    }

    return { ok: false, usuario: null, mensaje: 'Credenciales incorrectas' };

  } catch (error) {
    console.error("Error en auth.service:", error);
    return { ok: false, usuario: null, mensaje: 'Error al conectar con el servicio' };
  }
};

/**
 * @function register
 * 
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


// --- FUNCIONES PARA EL ADMIN ---

/**
 * @function getRegisteredUsers
 * @description Obtiene (lee) TODOS los usuarios de localStorage
 * La hacemos 'async' para simular una llamada real
 */
export const getRegisteredUsers = async (): Promise<IUsuario[]> => {
  try {
    const usuariosGuardados = localStorage.getItem(LOCAL_STORAGE_KEY);
    return usuariosGuardados ? JSON.parse(usuariosGuardados) : [];
  } catch (error) {
    console.error("Error al leer usuarios:", error);
    return [];
  }
};

/**
 * @function updateUserRole
 * @description Actualiza el ROL (tipo) de un usuario en localStorage
 */
export const updateUserRole = async (userId: number, nuevoRol: IUsuario["tipo"]): Promise<boolean> => {
  try {
    const usuarios = await getRegisteredUsers();
    
    // Buscamos al usuario y actualizamos su tipo
    const usuariosActualizados = usuarios.map(u => 
      u.id === userId ? { ...u, tipo: nuevoRol } : u
    );
    
    // Guardamos la lista completa de vuelta
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(usuariosActualizados));
    return true;
  } catch (error) {
    console.error("Error al actualizar rol:", error);
    return false;
  }
};

/**
 * @function deleteUser
 * @description Elimina un usuario de localStorage por su ID
 */
export const deleteUser = async (userId: number): Promise<boolean> => {
  try {
    const usuarios = await getRegisteredUsers();
    
    // Filtramos la lista, quitando al usuario con ese ID
    const usuariosActualizados = usuarios.filter(u => u.id !== userId);
    
    // Guardamos la lista filtrada de vuelta
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(usuariosActualizados));
    return true;
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return false;
  }
};