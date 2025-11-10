



// src/models/usuario-model.ts

/**
 * @interface ILoginCredentials
 * @description El "molde" de lo que se necesita para el login
 */
export interface ILoginCredentials {
  email: string;
  password: string;
}

/**
 * @interface IUsuario
 * @description El "molde" completo de un usuario
 * (Coincide con todos los campos del formulario de registro)
 */
export interface IUsuario {
  id: number;
  nombre: string;
  apellidos: string;
  run: string;
  correo: string;
  password: string;
  fechaNacimiento: string;
  telefono: string; // Puede ser string vacío si es opcional
  direccion: string;
  region: string;
  comuna: string;
  codigoReferido: string; // Puede ser string vacío si es opcional
  tipo: "Cliente" | "Administrador" | "Vendedor";
}