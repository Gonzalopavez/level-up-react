// src/components/admin/UserEditModal.tsx
import React, { useEffect, useState } from "react";
import type { IUsuario } from "../../models/usuario-model";
import { validarUsuarioCompleto, type ValidationErrors, formatFechaInput } from "../../utils/validaciones-usuario-modal";
import Swal from "sweetalert2";

/* Reutilizamos el mismo set de regiones/comunas que en registro */
const regionesYComunas = [
  { nombre: "Región Metropolitana", comunas: ["Santiago", "Providencia", "Las Condes", "Maipú", "Puente Alto"] },
  { nombre: "Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana"] },
  { nombre: "Biobío", comunas: ["Concepción", "Talcahuano", "San Pedro de la Paz", "Chiguayante"] },
];

type Props = {
  visible: boolean;
  usuario: IUsuario | null;
  onClose: () => void;
  onSave: (usuarioActualizado: Partial<IUsuario>) => Promise<boolean>;
};

export const UserEditModal: React.FC<Props> = ({ visible, usuario, onClose, onSave }) => {
  const [form, setForm] = useState<Partial<IUsuario>>({});
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (usuario) {
      setForm({
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        fechaNacimiento: usuario.fechaNacimiento,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        region: usuario.region,
        comuna: usuario.comuna,
        codigoReferido: usuario.codigoReferido,
        tipo: usuario.tipo
      });
      setErrors({});
    }
  }, [usuario]);

  useEffect(() => {
    if (visible) {
      const el = document.getElementById("modalEditarUsuario");
      if (el) {
        const modal = new (window as any).bootstrap.Modal(el);
        modal.show();
      }
    }
  }, [visible]);

  const handleChange = (name: keyof IUsuario, value: any) => {
    // Si es fecha, autoformatear
    if (name === "fechaNacimiento") {
      value = formatFechaInput(value || "");
    }

    // Si cambiamos región, limpiamos comuna
    if (name === "region") {
      setForm(prev => ({ ...prev, region: value, comuna: "" }));
      setErrors(prev => ({ ...prev, region: "", comuna: "" }));
      return;
    }

    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSave = async () => {
    if (!usuario) return;

    // Validamos usando la función central. skipRun = true porque run no editable
    const datos = { ...usuario, ...form };
    const { valid, errors: vErrors } = validarUsuarioCompleto(datos, { skipRun: true });

    if (!valid) {
      setErrors(vErrors);
      const primeraClave = Object.keys(vErrors)[0];
      Swal.fire("Error de validación", vErrors[primeraClave], "error");
      return;
    }

    // Llamamos al onSave con los campos editables (no cambiamos run)
    const ok = await onSave({ ...form, run: usuario.run });
    if (ok) {
      const el = document.getElementById("modalEditarUsuario");
      const modal = (window as any).bootstrap.Modal.getInstance(el);
      if (modal) modal.hide();
    } else {
      Swal.fire("Error", "No se pudo guardar en el servidor.", "error");
    }
  };

  if (!usuario) return null;

  return (
    <div id="modalEditarUsuario" className="modal fade" tabIndex={-1} aria-hidden={!visible}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content modal-neon-admin">
          <div className="modal-header">
            <h5 className="modal-title">Editar usuario: {usuario.nombre} {usuario.apellidos}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <div className="row g-3">

              <div className="col-md-6">
                <label className="form-label">Nombre</label>
                <input className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                  value={form.nombre || ""} onChange={(e) => handleChange("nombre", e.target.value)} />
                {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Apellidos</label>
                <input className={`form-control ${errors.apellidos ? "is-invalid" : ""}`}
                  value={form.apellidos || ""} onChange={(e) => handleChange("apellidos", e.target.value)} />
                {errors.apellidos && <div className="invalid-feedback">{errors.apellidos}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label">RUN (no editable)</label>
                <input className="form-control" value={usuario.run} disabled />
              </div>

              <div className="col-md-6">
                <label className="form-label">Correo</label>
                <input className={`form-control ${errors.correo ? "is-invalid" : ""}`}
                  type="email" value={form.correo || ""} onChange={(e) => handleChange("correo", e.target.value)} />
                {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Fecha de Nacimiento (dd/mm/aaaa)</label>
                <input className={`form-control ${errors.fechaNacimiento ? "is-invalid" : ""}`}
                  value={form.fechaNacimiento || ""} onChange={(e) => handleChange("fechaNacimiento", e.target.value)} />
                {errors.fechaNacimiento && <div className="invalid-feedback">{errors.fechaNacimiento}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Teléfono (opcional)</label>
                <input className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
                  value={form.telefono || ""} onChange={(e) => handleChange("telefono", e.target.value)} />
                {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Dirección</label>
                <input className={`form-control ${errors.direccion ? "is-invalid" : ""}`}
                  value={form.direccion || ""} onChange={(e) => handleChange("direccion", e.target.value)} />
                {errors.direccion && <div className="invalid-feedback">{errors.direccion}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Región</label>
                <select className={`form-select ${errors.region ? "is-invalid" : ""}`}
                  value={form.region || ""} onChange={(e) => handleChange("region", e.target.value)}>
                  <option value="">Selecciona...</option>
                  {regionesYComunas.map(r => <option key={r.nombre} value={r.nombre}>{r.nombre}</option>)}
                </select>
                {errors.region && <div className="invalid-feedback">{errors.region}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Comuna</label>
                <select className={`form-select ${errors.comuna ? "is-invalid" : ""}`}
                  value={form.comuna || ""} onChange={(e) => handleChange("comuna", e.target.value)}>
                  <option value="">Selecciona...</option>
                  {regionesYComunas.find(r => r.nombre === form.region)?.comunas.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.comuna && <div className="invalid-feedback">{errors.comuna}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Código referido (opcional)</label>
                <input className={`form-control ${errors.codigoReferido ? "is-invalid" : ""}`}
                  value={form.codigoReferido || ""} onChange={(e) => handleChange("codigoReferido", e.target.value)} />
                {errors.codigoReferido && <div className="invalid-feedback">{errors.codigoReferido}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Rol</label>


                <select
    className="form-select"
    value={form.tipo || usuario.tipo || "Cliente"}
    onChange={(e) => handleChange("tipo", e.target.value)}
    disabled={usuario.id === JSON.parse(localStorage.getItem("currentUser") || "{}").id}
  >
    <option value="Cliente">Cliente</option>
    <option value="Vendedor">Vendedor</option>
    <option value="Administrador">Administrador</option>
  </select>

  {usuario.id === JSON.parse(localStorage.getItem("currentUser") || "{}").id && (
    <small className="text-warning">
      No puedes cambiar tu propio rol.
    </small>
  )}



              </div>

            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={onClose}>
              Cancelar
            </button>
            <button type="button" className="btn btn-gamer" onClick={handleSave}>
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
