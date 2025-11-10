// src/pages/registroPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import type { IUsuario } from '../models/usuario-model';
import { register } from '../services/auth-service'; 
import { useAuth } from '../hooks/useAuth';

// --- Validaciones (No cambian) ---
const regionesYComunas = [
    { nombre: "Región Metropolitana", comunas: ["Santiago", "Providencia", "Las Condes"] },
    { nombre: "Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Quilpué"] },
    { nombre: "Biobío", comunas: ["Concepción", "Talcahuano", "San Pedro de la Paz"] },
];

const validators = {
  nombre: (valor: string): string | null => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/;
    if (!regex.test(valor)) return "Ingresa un nombre válido (solo letras y espacios, 3-50 caracteres).";
    return null;
  },
  apellidos: (valor: string): string | null => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,100}$/;
    if (!regex.test(valor)) return "Ingresa apellidos válidos (solo letras y espacios, 3-100 caracteres).";
    return null;
  },
  run: (valor: string): string | null => {
    const runLimpio = valor.replace(/[\s.-]/g, '').toUpperCase();
    if (!/^[0-9]{7,8}[0-9K]$/.test(runLimpio)) return "Formato de RUN inválido.";
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
    if (dv !== dvFinal) return "El dígito verificador del RUN no es válido.";
    return null;
  },
  correo: (valor: string): string | null => {
    const regex = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
    if (!regex.test(valor)) return "Correo inválido. Dominios permitidos: duoc.cl, profesor.duoc.cl, gmail.com.";
    return null;
  },
  password: (valor: string): string | null => {
    if (valor.length < 4 || valor.length > 10) return "La contraseña debe tener entre 4 y 10 caracteres.";
    return null;
  },
  confirmPassword: (valor: string, passOriginal: string): string | null => {
    if (valor !== passOriginal) return "Las contraseñas no coinciden.";
    return null;
  },
  fechaNacimiento: (valor: string): string | null => {
    const regexFecha = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = valor.match(regexFecha);
    if (!match) return "Formato de fecha debe ser dd/mm/aaaa.";
    const dia = parseInt(match[1], 10);
    const mes = parseInt(match[2], 10) - 1;
    const anio = parseInt(match[3], 10);
    const fecha = new Date(anio, mes, dia);
    if (fecha.getFullYear() !== anio || fecha.getMonth() !== mes || fecha.getDate() !== dia) return "Fecha inválida (ej: 31/02).";
    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const m = hoy.getMonth() - fecha.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) edad--;
    if (edad < 18) return "Debes ser mayor de 18 años.";
    if (edad > 115) return "Edad inválida.";
    return null;
  },
  telefono: (valor: string): string | null => {
    if (valor === "") return null; // Es opcional
    const regex = /^[0-9]{9,15}$/;
    if (!regex.test(valor)) return "Teléfono inválido (9-15 dígitos).";
    return null;
  },
  direccion: (valor: string): string | null => {
    if (valor === "" || valor.length > 300) return "La dirección es requerida (máx 300 caracteres).";
    return null;
  },
  region: (valor: string): string | null => {
    if (valor === "") return "Debes seleccionar una región.";
    return null;
  },
  comuna: (valor: string): string | null => {
    if (valor === "") return "Debes seleccionar una comuna.";
    return null;
  },
  codigoReferido: (valor: string): string | null => {
    if (valor === "") return null; // Es opcional
    const regex = /^[a-zA-Z0-9]{1,20}$/;
    if (!regex.test(valor)) return "Código inválido (solo letras/números, máx 20).";
    return null;
  }
};

// --- El Componente (Página) de React ---
export const RegistroPage: React.FC = () => {
  const navigate = useNavigate();
  const { login: autoLogin } = useAuth(); 

  const [formData, setFormData] = useState({
    nombre: '', apellidos: '', run: '', correo: '', password: '',
    confirmPassword: '', fechaNacimiento: '', telefono: '',
    direccion: '', region: '', comuna: '', codigoReferido: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string | null>>(Object.fromEntries(
    Object.keys(formData).map(key => [key, null])
  ));
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "fechaNacimiento") {
      let valor = value.replace(/\D/g, "").slice(0, 8);
      if (valor.length > 4) valor = `${valor.slice(0, 2)}/${valor.slice(2, 4)}/${valor.slice(4)}`;
      else if (valor.length > 2) valor = `${valor.slice(0, 2)}/${valor.slice(2)}`;
      setFormData(prev => ({ ...prev, [name]: valor }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // --- FUNCIÓN ARREGLADA ---
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target as { name: keyof typeof formData; value: string };
    let error: string | null = null;
    
    if (name === 'confirmPassword') {
      // Caso especial (2 argumentos)
      error = validators.confirmPassword(value, formData.password);
    } else if (name in validators) {
      // --- ¡¡AQUÍ ESTÁ EL ARREGLO!! ---
      // Le decimos a TypeScript que esta función SÓLO toma 1 argumento
      const validator = validators[name] as (val: string) => string | null;
      error = validator(value);
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value, comuna: '' }));
    
    // Validamos 'region' manualmente
    setErrors(prev => ({ ...prev, [name]: validators[name as 'region'](value) }));
  };
  
  // --- FUNCIÓN ARREGLADA ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors: Record<string, string | null> = {};
    Object.keys(formData).forEach(key => {
      const name = key as keyof typeof formData;

      if (name === 'confirmPassword') {
        // Caso especial (2 argumentos)
        validationErrors[name] = validators.confirmPassword(formData[name], formData.password);
      } else if (name in validators) {
        // --- ¡¡AQUÍ ESTÁ EL ARREGLO!! ---
        // Hacemos lo mismo que en handleBlur
        const validator = validators[name] as (val: string) => string | null;
        validationErrors[name] = validator(formData[name]);
      }
    });
    
    setErrors(validationErrors);
    
    const hayErrores = Object.values(validationErrors).some(error => error !== null);
    
    if (hayErrores) {
      Swal.fire({
          icon: 'error',
          title: 'Formulario incompleto',
          text: 'Por favor, revisa los campos marcados.'
      });
      return;
    }
    
    const nuevoUsuario: IUsuario = {
      id: Date.now(),
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

    const resultado = register(nuevoUsuario);

    if (resultado.success) {
      Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Tu cuenta ha sido creada.'
      });
      
      // Auto-login (corregido para 2 argumentos)
      await autoLogin(nuevoUsuario.correo, nuevoUsuario.password);
      
      navigate('/');

    } else {
      Swal.fire({
          icon: 'warning',
          title: 'Correo ya registrado',
          text: resultado.message
      });
    }
  };

  // --- Lógica del formulario (no cambia) ---
  const comunasDeRegion = regionesYComunas.find(r => r.nombre === formData.region)?.comunas || [];
  const esDuoc = formData.correo.endsWith('@duoc.cl') || formData.correo.endsWith('@profesor.duoc.cl');

  // --- EL HTML (JSX) (no cambia) ---
  return (
    <main className="flex-grow-1">
      <div className="container" style={{ marginTop: '10vh' }}>
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">

            <h1 className="text-center mb-4 titulo-animado">
              <i className="bi bi-person-plus me-2"></i> CREAR CUENTA
            </h1>

            <form id="registroForm" noValidate className="p-4 rounded bg-dark form-neon" onSubmit={handleSubmit}>
              
              {/* Nombre */}
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">Primer nombre</label>
                <input type="text" 
                  className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                  id="nombre" name="nombre" 
                  value={formData.nombre} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required maxLength={50} />
                <div className="invalid-feedback">{errors.nombre}</div>
              </div>

              {/* Apellidos */}
              <div className="mb-3">
                <label htmlFor="apellidos" className="form-label">Apellidos</label>
                <input type="text" 
                  className={`form-control ${errors.apellidos ? 'is-invalid' : ''}`}
                  id="apellidos" name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required maxLength={100} />
                <div className="invalid-feedback">{errors.apellidos}</div>
              </div>
              
              {/* RUN */}
              <div className="mb-3">
                <label htmlFor="run" className="form-label">RUN</label>
                <input type="text"
                  className={`form-control ${errors.run ? 'is-invalid' : ''}`}
                  id="run" name="run" placeholder="12345678K"
                  value={formData.run}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required maxLength={9} />
                <div className="invalid-feedback">{errors.run}</div>
              </div>
              
              {/* Correo */}
              <div className="mb-3">
                <label htmlFor="correo" className="form-label">Correo electrónico</label>
                <input type="email"
                  className={`form-control ${errors.correo ? 'is-invalid' : ''}`}
                  id="correo" name="correo" placeholder="Ejemplo@duoc.cl"
                  value={formData.correo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required maxLength={100} />
                <div className="invalid-feedback">{errors.correo}</div>
                {esDuoc && !errors.correo && (
                  <div className="alert alert-success mt-2 d-block">
                    ¡Felicidades! Como usuario DUOC, tienes un 20% de descuento.
                  </div>
                )}
              </div>
              
              {/* Password */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <input type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  id="password" name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required minLength={4} maxLength={10} />
                <div className="invalid-feedback">{errors.password}</div>
                <div className="form-text-small-contraseña">
                  La contraseña debe tener entre 4 y 10 caracteres.
                </div>
              </div>
              
              {/* Confirmar Password */}
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                <input type="password"
                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  id="confirmPassword" name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required />
                <div className="invalid-feedback">{errors.confirmPassword}</div>
              </div>

              {/* Fecha Nacimiento */}
              <div className="mb-3">
                <label htmlFor="fechaNacimiento" className="form-label">Fecha de Nacimiento</label>
                <input type="text"
                  className={`form-control ${errors.fechaNacimiento ? 'is-invalid' : ''}`}
                  id="fechaNacimiento" name="fechaNacimiento" placeholder="dd/mm/aaaa"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={10} />
                <div className="invalid-feedback">{errors.fechaNacimiento}</div>
              </div>

              {/* Telefono */}
              <div className="mb-3">
                <label htmlFor="telefono" className="form-label">Teléfono (opcional)</label>
                <input type="tel"
                  className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                  id="telefono" name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  onBlur={handleBlur} />
                <div className="invalid-feedback">{errors.telefono}</div>
              </div>
              
              {/* Direccion */}
              <div className="mb-3">
                <label htmlFor="direccion" className="form-label">Dirección</label>
                <input type="text"
                  className={`form-control ${errors.direccion ? 'is-invalid' : ''}`}
                  id="direccion" name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required />
                <div className="invalid-feedback">{errors.direccion}</div>
              </div>
              
              {/* Region */}
              <div className="mb-3">
                <label htmlFor="region" className="form-label">Región</label>
                <select
                  className={`form-select ${errors.region ? 'is-invalid' : ''}`}
                  id="region" name="region"
                  value={formData.region}
                  onChange={handleRegionChange}
                  onBlur={handleBlur}
                  required>
                  <option value="">Selecciona una región</option>
                  {regionesYComunas.map(r => (
                    <option key={r.nombre} value={r.nombre}>{r.nombre}</option>
                  ))}
                </select>
                <div className="invalid-feedback">{errors.region}</div>
              </div>
              
              {/* Comuna */}
              <div className="mb-3">
                <label htmlFor="comuna" className="form-label">Comuna</label>
                <select
                  className={`form-select ${errors.comuna ? 'is-invalid' : ''}`}
                  id="comuna" name="comuna"
                  value={formData.comuna}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={comunasDeRegion.length === 0}
                  required>
                  <option value="">Selecciona una comuna</option>
                  {comunasDeRegion.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="invalid-feedback">{errors.comuna}</div>
              </div>
              
              {/* Código de referido */}
              <div className="mb-3">
                <label htmlFor="codigoReferido" className="form-label">Código de referido (opcional)</label>
                <input type="text"
                  className={`form-control ${errors.codigoReferido ? 'is-invalid' : ''}`}
                  id="codigoReferido" name="codigoReferido"
                  value={formData.codigoReferido}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={20} />
                <div className="invalid-feedback">{errors.codigoReferido}</div>
              </div>

              {/* Botón Submit */}
              <button type="submit" className="btn btn-gamer w-100">Crear cuenta</button>
            </form>
          </div>
        </div>
      </div>
      <br /><br /><br />
    </main>
  );
};