// src/components/admin/GestionUsuarios.tsx
import React, { useEffect, useState } from "react";
import type { IUsuario } from "../../models/usuario-model";
import { getRegisteredUsers, deleteUser, updateUser } from "../../services/user-service";
import { UserEditModal } from "./UserEditModal";
import Swal from "sweetalert2";

export const GestionUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingUser, setEditingUser] = useState<IUsuario | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  const cargarUsuarios = async () => {
    setLoading(true);
    const data = await getRegisteredUsers();
    setUsuarios(data);
    setLoading(false);
  };

  useEffect(() => {
    void cargarUsuarios();
  }, []);

  const handleDelete = async (u: IUsuario) => {
    if (!u.id) return;

    if (u.tipo === "Administrador") {
      Swal.fire("Atención", "No puedes eliminar al Administrador principal.", "warning");
      return;
    }

    if (currentUser?.id === u.id) {
      Swal.fire("Atención", "No puedes eliminar tu propia cuenta.", "warning");
      return;
    }

    const confirmed = await Swal.fire({
      title: "¿Confirmas eliminar?",
      text: `Eliminar a ${u.nombre} ${u.apellidos}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
    });

    if (confirmed.isConfirmed) {
      const ok = await deleteUser(u.id);
      if (ok) {
        Swal.fire("Eliminado", "Usuario eliminado correctamente.", "success");
        cargarUsuarios();
      } else {
        Swal.fire("Error", "No se pudo eliminar usuario.", "error");
      }
    }
  };

  const abrirEdicion = (u: IUsuario) => {
    setEditingUser(u);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setEditingUser(null);
  };

  const guardarEdicion = async (datos: Partial<IUsuario>) => {
    if (!editingUser?.id) return false;

    // Aseguramos no cambiar el run
    const payload: Partial<IUsuario> = { ...datos, run: editingUser.run };

    const ok = await updateUser(editingUser.id, payload);
    if (ok) {
      Swal.fire("Guardado", "Usuario actualizado correctamente.", "success");
      cargarUsuarios();
      setModalVisible(false);
      setEditingUser(null);
      return true;
    } else {
      Swal.fire("Error", "No se pudo guardar los cambios.", "error");
      return false;
    }
  };

  if (loading) return <div>Cargando usuarios...</div>;

  return (
    <div>
      <h3 className="text-neon mb-4">Gestión de Usuarios</h3>

      <div className="table-responsive">
        <table className="table table-dark table-striped align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>RUN</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.run}</td>
                <td>{u.nombre} {u.apellidos}</td>
                <td>{u.correo}</td>
                <td>{u.tipo}</td>
                <td className="text-center">
                  <button className="btn btn-sm btn-primary me-2" onClick={() => abrirEdicion(u)}>Editar</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u)} disabled={u.tipo === "Administrador"}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal controlado */}
      <UserEditModal
        visible={modalVisible}
        usuario={editingUser}
        onClose={cerrarModal}
        onSave={guardarEdicion}
      />
    </div>
  );
};
