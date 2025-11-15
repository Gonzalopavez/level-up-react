
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import type { IUsuario } from '../../models/usuario-model';

import { getRegisteredUsers, updateUserRole, deleteUser } from '../../services/auth-service';

export const GestionUsuarios: React.FC = () => {

  // --- Estados (Memoria) ---
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Carga de Datos ---
  // Función para (re)cargar los usuarios
  const cargarUsuarios = async () => {
    try {
      setIsLoading(true);
      const data = await getRegisteredUsers();
      setUsuarios(data);
      setError(null);
    } catch (err) {
      setError("No se pudieron cargar los usuarios.");
    } finally {
      setIsLoading(false);
    }
  };

  // Carga inicial al montar el componente
  useEffect(() => {
    cargarUsuarios();
  }, []); // El [] significa: "ejecútalo solo una vez al cargar"

  // --- Handlers (Manejadores de Acciones) ---

  const handleCambiarRol = async (userId: number, nuevoRol: IUsuario["tipo"]) => {
    // 1. Confirmación
    const confirm = await Swal.fire({
      title: '¿Cambiar Rol?',
      text: `¿Estás seguro de que quieres cambiar el rol de este usuario a "${nuevoRol}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8A2BE2',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, cambiar'
    });

    if (confirm.isConfirmed) {
      // 2. Llamamos al "Camarero"
      const exito = await updateUserRole(userId, nuevoRol);
      
      if (exito) {
        // 3. Si todo OK, refrescamos la tabla
        cargarUsuarios(); 
        Swal.fire('¡Actualizado!', 'El rol del usuario ha sido cambiado.', 'success');
      } else {
        Swal.fire('Error', 'No se pudo actualizar el rol.', 'error');
      }
    }
  };

  const handleEliminar = async (userId: number, userName: string) => {
    // 1. Confirmación
    const confirm = await Swal.fire({
      title: `¿Eliminar a ${userName}?`,
      text: "¡Esta acción no se puede revertir!",
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar'
    });

    if (confirm.isConfirmed) {
      // 2. Llamamos al "Camarero"
      const exito = await deleteUser(userId);
      
      if (exito) {
        // 3. Si todo OK, refrescamos la tabla
        cargarUsuarios();
        Swal.fire('¡Eliminado!', 'El usuario ha sido eliminado.', 'success');
      } else {
        Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
      }
    }
  };

  // --- Renderizado ---
  if (isLoading) return <p>Cargando usuarios...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <h3 className="text-neon mb-3">Gestión de Usuarios Registrados</h3>
      <p>
        Aquí puedes gestionar los usuarios creados a través del formulario de registro. 
        <br/>
        <strong className="text-warning">Nota:</strong> Los usuarios "base" (como 'waco@duoc.cl') viven en el archivo `.json` y no se pueden gestionar desde aquí.
      </p>

      {usuarios.length === 0 ? (
        <p>No hay usuarios registrados en localStorage.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-striped table-hover">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol Actual</th>
                <th>Cambiar Rol</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(user => (
                <tr key={user.id}>
                  <td>{user.nombre} {user.apellidos}</td>
                  <td>{user.correo}</td>
                  <td>
                    {/* Mostramos el rol con un color bonito */}
                    <span className={`badge ${
                      user.tipo === 'Administrador' ? 'bg-danger' :
                      user.tipo === 'Vendedor' ? 'bg-info' : 'bg-secondary'
                    }`}>
                      {user.tipo}
                    </span>
                  </td>
                  <td>
                    {/* Un <select> para cambiar el rol */}
                    <select 
                      className="form-select form-select-sm bg-dark text-white" 
                      value={user.tipo} // El valor actual
                      onChange={(e) => handleCambiarRol(user.id, e.target.value as IUsuario["tipo"])} // Llama al handler al cambiar
                    >
                      <option value="Cliente">Cliente</option>
                      <option value="Vendedor">Vendedor</option>
                      <option value="Administrador">Administrador</option>
                    </select>
                  </td>
                  <td>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleEliminar(user.id, user.nombre)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};