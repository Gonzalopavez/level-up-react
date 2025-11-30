// src/services/user-service.ts
import type { IUsuario } from "../models/usuario-model";

const API_URL = "http://localhost:8080/api/usuarios";

// Obtener todos los usuarios
export const getRegisteredUsers = async (): Promise<IUsuario[]> => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Error getRegisteredUsers:", err);
    return [];
  }
};

// Eliminar usuario
export const deleteUser = async (id: number): Promise<boolean> => {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    return res.ok;
  } catch (err) {
    console.error("Error deleteUser:", err);
    return false;
  }
};

// Actualizar solo el ROL
export const updateUserRole = async (id: number, tipo: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API_URL}/${id}/rol`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      // backend espera el valor directamente o un JSON con "tipo": "X"
      body: JSON.stringify(tipo), // si backend espera string raw, este es el body; si espera JSON, cambia a JSON.stringify({ tipo })
    });

    // Si backend espera JSON { "tipo": "Vendedor" } en el body:
    // body: JSON.stringify({ tipo })
    return res.ok;
  } catch (err) {
    console.error("Error updateUserRole:", err);
    return false;
  }
};

// Actualización de usuario (envía solo los campos que le des)
export const updateUser = async (id: number, usuario: Partial<IUsuario>): Promise<boolean> => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });
    return res.ok;
  } catch (err) {
    console.error("Error updateUser:", err);
    return false;
  }
};
