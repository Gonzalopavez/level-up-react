// src/utils/validaciones-usuario-modal.ts

export type ValidationErrors = { [key: string]: string };

/* -------------------------------
   Helper: Formateo de fecha (auto)
   Entrada: cadena (posible con o sin '/')
   Salida: 'dd/mm/yyyy' parcial o completo, max 10 chars
   Ej: '2' -> '2'
       '23' -> '23/'
       '2304' -> '23/04/'
       '23042004' -> '23/04/2004'
   ------------------------------- */
export const formatFechaInput = (raw: string): string => {
  const digits = (raw || "").replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
};

export const validarRUN = (run: string): boolean => {
  const runLimpio = (run || '').replace(/[\s.-]/g, '').toUpperCase();
  if (!/^[0-9]{7,8}[0-9K]$/.test(runLimpio)) return false;

  const cuerpo = runLimpio.slice(0, -1);
  const dv = runLimpio.slice(-1);

  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i), 10) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const dvEsperado = 11 - (suma % 11);
  const dvFinal = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

  return dv === dvFinal;
};

export const validators = {
  nombre: (v: string) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/.test((v || "").trim()),
  apellidos: (v: string) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,100}$/.test((v || "").trim()),
  correo: (v: string) =>
    /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test((v || "").trim()),
  telefono: (v: string) => (v === "" || v === undefined) || /^[0-9]{9,15}$/.test((v || "").trim()),
  direccion: (v: string) => !!(v && v.trim().length > 0 && v.trim().length <= 300),
  codigoReferido: (v: string) => (v === "" || v === undefined) || /^[a-zA-Z0-9]{1,20}$/.test((v || "").trim()),
  region: (v: string) => !!(v && v.trim().length > 0),
  comuna: (v: string) => !!(v && v.trim().length > 0)
};

/* Comprueba si una fecha dd/mm/yyyy es válida (días por mes y año bisiesto) */
const isValidDateParts = (dd: number, mm: number, yyyy: number): boolean => {
  if (yyyy < 1900 || yyyy > 2100) return false;
  if (mm < 1 || mm > 12) return false;
  const diasMes = [31, (yyyy % 4 === 0 && yyyy % 100 !== 0) || (yyyy % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (dd < 1 || dd > diasMes[mm - 1]) return false;
  return true;
};

/* Comprueba si la fecha no está en el futuro */
const isFutureDate = (dd: number, mm: number, yyyy: number): boolean => {
  const today = new Date();
  const d = new Date(yyyy, mm - 1, dd);
  return d.getTime() > today.getTime();
};

/* Comprueba si la edad es >= 18 años */
const isAdult = (dd: number, mm: number, yyyy: number): boolean => {
  const today = new Date();
  let age = today.getFullYear() - yyyy;
  const mDiff = today.getMonth() + 1 - mm;
  const dDiff = today.getDate() - dd;
  if (mDiff < 0 || (mDiff === 0 && dDiff < 0)) age--;
  return age >= 18;
};

/* Validación combinada para fechaNacimiento:
   - formato dd/mm/yyyy
   - fecha sensata (día/mes correcto)
   - no futura
   - edad >= 18
*/
export const validateFechaCompleta = (valor: string): { ok: boolean; message?: string } => {
  if (!valor || valor.trim().length === 0) {
    return { ok: false, message: "Fecha requerida (dd/mm/yyyy)" };
  }
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(valor)) {
    return { ok: false, message: "Formato debe ser dd/mm/yyyy" };
  }
  const [ddStr, mmStr, yyyyStr] = valor.split("/");
  const dd = parseInt(ddStr, 10);
  const mm = parseInt(mmStr, 10);
  const yyyy = parseInt(yyyyStr, 10);
  if (!isValidDateParts(dd, mm, yyyy)) {
    return { ok: false, message: "Fecha inválida" };
  }
  if (isFutureDate(dd, mm, yyyy)) {
    return { ok: false, message: "Fecha en el futuro no permitida" };
  }
  if (!isAdult(dd, mm, yyyy)) {
    return { ok: false, message: "El usuario debe ser mayor de 18 años" };
  }
  return { ok: true };
};

/**
 * Valida un usuario parcial o completo y devuelve {valid, errors}
 * - skipRun: si true, no valida run (útil si el modal no lo edita)
 */
export const validarUsuarioCompleto = (
  datos: { [k: string]: any },
  options?: { skipRun?: boolean }
): { valid: boolean; errors: ValidationErrors } => {
  const errors: ValidationErrors = {};

  if (!options?.skipRun) {
    if (!datos.run || !validarRUN(datos.run)) {
      errors.run = "RUN inválido";
    }
  }

  if (!datos.nombre || !validators.nombre(datos.nombre)) {
    errors.nombre = "Nombre inválido (solo letras, 3-50 caracteres)";
  }

  if (!datos.apellidos || !validators.apellidos(datos.apellidos)) {
    errors.apellidos = "Apellidos inválidos (solo letras, 3-100 caracteres)";
  }

  if (!datos.correo || !validators.correo(datos.correo)) {
    errors.correo = "Correo inválido (solo duoc.cl / profesor.duoc.cl / gmail.com)";
  }

  // fechaNacimiento: validación avanzada
  const fechaCheck = validateFechaCompleta(datos.fechaNacimiento || "");
  if (!fechaCheck.ok) {
    errors.fechaNacimiento = fechaCheck.message || "Fecha inválida (dd/mm/yyyy)";
  }

  if (!validators.telefono(datos.telefono || "")) {
    errors.telefono = "Teléfono inválido (9-15 dígitos) o vacío";
  }

  if (!validators.direccion(datos.direccion || "")) {
    errors.direccion = "Dirección obligatoria (máx 300 caracteres)";
  }

  if (!validators.region(datos.region || "")) {
    errors.region = "Región requerida";
  }

  if (!validators.comuna(datos.comuna || "")) {
    errors.comuna = "Comuna requerida";
  }

  if (!validators.codigoReferido(datos.codigoReferido || "")) {
    errors.codigoReferido = "Código referido inválido (solo alfanumérico, max 20)";
  }

  const valid = Object.keys(errors).length === 0;
  return { valid, errors };
};
