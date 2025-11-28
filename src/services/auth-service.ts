import type { IUsuario, ILoginCredentials } from "../models/usuario-model";

const API_URL_AUTH = "http://localhost:8080/api/auth";

export interface LoginResult {
  ok: boolean;
  usuario: IUsuario | null;
  mensaje: string;
}

// LOGIN
export const login = async (credentials: ILoginCredentials): Promise<LoginResult> => {
  try {
    const res = await fetch(`${API_URL_AUTH}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (res.ok) {
      const usuario = await res.json();
      localStorage.setItem("currentUser", JSON.stringify(usuario));
      return { ok: true, usuario, mensaje: "Inicio de sesión exitoso" };
    }

    const err = await res.json().catch(() => ({}));
    return { ok: false, usuario: null, mensaje: err.message || "Credenciales incorrectas" };
  } catch {
    return { ok: false, usuario: null, mensaje: "Error de conexión" };
  }
};

// REGISTER
export const register = async (nuevoUsuario: IUsuario) => {
  try {
    const res = await fetch(`${API_URL_AUTH}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoUsuario),
    });

    if (res.ok) {
      const usuarioCreado = await res.json();
      return { success: true, usuario: usuarioCreado };
    }

    const err = await res.json();
    return { success: false, message: err.message || "Error al registrar" };
  } catch {
    return { success: false, message: "No hay conexión" };
  }
};

// LOGOUT
export const logout = () => {
  localStorage.removeItem("currentUser");
};
