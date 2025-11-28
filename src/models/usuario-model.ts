// Archivo: src/models/usuario-model.ts

export interface IUsuario {
    id?: number; // El ? lo hace opcional para cuando estás registrando, pero obligatorio al venir de la BD
    run: string;
    nombre: string;
    apellidos: string;
    correo: string;
    password?: string; // Opcional porque al traer usuarios de la lista, a veces no traemos la password por seguridad
    fechaNacimiento?: string;
    telefono?: string;
    region?: string;
    comuna?: string;
    direccion?: string;
    codigoReferido?: string;
    tipo?: "Cliente" | "Vendedor" | "Administrador" | string; // Para el manejo de roles
}

export interface ILoginCredentials {
    correo: string;
    password: string;
}