import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import type { IUsuario } from '../models/usuario-model';
import { register } from '../services/auth-service';

// Importar estilos
import '../main.css';

// ======================
// Regiones y Comunas
// ======================
const regionesYComunas = [
  { nombre: "Región Metropolitana", comunas: ["Santiago", "Providencia", "Las Condes", "Maipú", "Puente Alto"] },
  { nombre: "Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana"] },
  { nombre: "Biobío", comunas: ["Concepción", "Talcahuano", "San Pedro de la Paz", "Chiguayante"] },
];

// ===========================
// Validación RUN EXACTA (DV)
// ===========================
const validarRUN = (run: string): boolean => {
  const runLimpio = run.replace(/[\s.-]/g, '').toUpperCase();
  if (!/^[0-9]{7,8}[0-9K]$/.test(runLimpio)) return false;

  const cuerpo = runLimpio.slice(0, -1);
  const dv = runLimpio.slice(-1);

  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i)) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const dvEsperado = 11 - (suma % 11);
  const dvFinal = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

  return dv === dvFinal;
};

// ===========================
// Validaciones EXACTAS del proyecto antiguo
// ===========================
const validators = {
  nombre: (v: string) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/.test(v),
  apellidos: (v: string) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,100}$/.test(v),
  correo: (v: string) =>
    /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(v),
  password: (v: string) => v.length >= 4 && v.length <= 10,
  telefono: (v: string) => v === "" || /^[0-9]{9,15}$/.test(v),
  direccion: (v: string) => v !== "" && v.length <= 300,
  codigoReferido: (v: string) => v === "" || /^[a-zA-Z0-9]{1,20}$/.test(v),
};

const RegistroPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    run: '',
    correo: '',
    password: '',
    confirmPassword: '',
    fechaNacimiento: '',
    telefono: '',
    direccion: '',
    region: '',
    comuna: '',
    codigoReferido: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [descuentoVisible, setDescuentoVisible] = useState(false);

  // ===========================
  // Cambios en inputs
  // ===========================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

    // Validaciones normales
    if (validators[name as keyof typeof validators]) {
      setErrors(prev => ({
        ...prev,
        [name]: !validators[name as keyof typeof validators](value)
      }));
    }

    // Validación RUN
    if (name === "run") {
      setErrors(prev => ({ ...prev, run: !validarRUN(value) }));
    }

    // Mostrar mensaje DUOC
    if (name === "correo") {
      setDescuentoVisible(
        value.endsWith("@duoc.cl") ||
        value.endsWith("@profesor.duoc.cl")
      );
    }
  };

  // ===========================
  // Autoformato fecha DD/MM/AAAA
  // ===========================
  const handleFechaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, "").slice(0, 8);
    if (valor.length > 4) valor = `${valor.slice(0, 2)}/${valor.slice(2, 4)}/${valor.slice(4)}`;
    else if (valor.length > 2) valor = `${valor.slice(0, 2)}/${valor.slice(2)}`;
    setFormData(prev => ({ ...prev, fechaNacimiento: valor }));
  };

  // ===========================
  // Enviar Formulario
  // ===========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones EXACTAS del JS antiguo
    if (!validarRUN(formData.run)) {
      Swal.fire("Error", "El RUN no es válido", "error");
      return;
    }
    if (!validators.nombre(formData.nombre)) {
      Swal.fire("Error", "Nombre inválido", "error");
      return;
    }
    if (!validators.apellidos(formData.apellidos)) {
      Swal.fire("Error", "Apellidos inválidos", "error");
      return;
    }
    if (!validators.correo(formData.correo)) {
      Swal.fire("Error", "Correo inválido", "error");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      Swal.fire("Error", "Las contraseñas no coinciden", "error");
      return;
    }

    const nuevoUsuario: IUsuario = {
      id: 0,
      nombre: formData.nombre,
      apellidos: formData.apellidos,
      run: formData.run,
      correo: formData.correo,
      password: formData.password,
      fechaNacimiento: formData.fechaNacimiento,
      telefono: formData.telefono,
      direccion: formData.direccion,
      region: formData.region,
      comuna: formData.comuna,
      codigoReferido: formData.codigoReferido,
      tipo: "Cliente"
    };

    try {
      Swal.fire({
        title: "Procesando...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      const resultado = await register(nuevoUsuario);

      if (resultado.success) {
        Swal.fire("¡Registro exitoso!", "Tu cuenta ha sido creada.", "success")
          .then(() => {

            // *** LOGIN AUTOMÁTICO ***
            if (resultado.usuario) {
              localStorage.setItem("currentUser", JSON.stringify(resultado.usuario));
              window.dispatchEvent(new Event("storage"));
            }

            // Redirigir al HOME
            navigate("/");
          });
      } else {
        Swal.fire("Error", resultado.message, "error");
      }

    } catch (err) {
      Swal.fire("Error", "No hay conexión con el servidor.", "error");
    }
  };

  // ===========================
  // UI
  // ===========================
  return (
    <div className="container pagina-registro">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">

          <h1 className="text-center mb-4 titulo-animado">
            <i className="bi bi-person-plus me-2"></i> CREAR CUENTA
          </h1>

          <form className="p-4 rounded bg-dark form-neon" onSubmit={handleSubmit}>

            {/* Nombre */}
            <div className="mb-3">
              <label className="form-label">Primer nombre</label>
              <input
                type="text"
                className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
              />
            </div>

            {/* Apellidos */}
            <div className="mb-3">
              <label className="form-label">Apellidos</label>
              <input
                type="text"
                className={`form-control ${errors.apellidos ? "is-invalid" : ""}`}
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
              />
            </div>

            {/* RUN */}
            <div className="mb-3">
              <label className="form-label">RUN</label>
              <input
                type="text"
                className={`form-control ${errors.run ? "is-invalid" : ""}`}
                name="run"
                value={formData.run}
                onChange={handleChange}
              />
            </div>

            {/* Correo */}
            <div className="mb-3">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                className={`form-control ${errors.correo ? "is-invalid" : ""}`}
                name="correo"
                value={formData.correo}
                onChange={handleChange}
              />
            </div>

            {descuentoVisible && (
              <div id="descuentoMensaje" className="alert alert-success mt-2">
                ¡Felicidades! Como usuario DUOC tienes 20% de descuento de por vida.
              </div>
            )}

            {/* Contraseña */}
            <div className="mb-3 password-wrapper">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Confirmación */}
            <div className="mb-3 password-wrapper">
              <label className="form-label">Confirmar Contraseña</label>
              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            {/* Fecha */}
            <div className="mb-3">
              <label className="form-label">Fecha de Nacimiento</label>
              <input
                type="text"
                className="form-control"
                name="fechaNacimiento"
                placeholder="dd/mm/aaaa"
                value={formData.fechaNacimiento}
                onChange={handleFechaInput}
              />
            </div>

            {/* Teléfono */}
            <div className="mb-3">
              <label className="form-label">Teléfono (opcional)</label>
              <input
                type="text"
                className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
              />
            </div>

            {/* Dirección */}
            <div className="mb-3">
              <label className="form-label">Dirección</label>
              <input
                type="text"
                className="form-control"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
              />
            </div>

            {/* Región */}
            <div className="mb-3">
              <label className="form-label">Región</label>
              <select
                className="form-select"
                name="region"
                value={formData.region}
                onChange={handleChange}
              >
                <option value="">Selecciona una región</option>
                {regionesYComunas.map(r => (
                  <option key={r.nombre} value={r.nombre}>{r.nombre}</option>
                ))}
              </select>
            </div>

            {/* Comuna */}
            <div className="mb-3">
              <label className="form-label">Comuna</label>
              <select
                className="form-select"
                name="comuna"
                value={formData.comuna}
                onChange={handleChange}
              >
                <option value="">Selecciona una comuna</option>
                {regionesYComunas
                  .find(r => r.nombre === formData.region)
                  ?.comunas.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
              </select>
            </div>

            <button type="submit" className="btn btn-gamer w-100 btn-lg">
              Crear Cuenta
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistroPage;
