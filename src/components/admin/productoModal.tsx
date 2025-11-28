// src/components/admin/ProductoModal.tsx
import React, { useEffect, useState } from "react";
import type { IProducto } from "../../models/producto-model";
import Swal from "sweetalert2";

type Props = {
  visible: boolean;
  initial?: Omit<IProducto, "id"> | null;
  onClose: () => void;
  onSave: (payload: Omit<IProducto, "id">) => Promise<boolean>;
};

/* ------------------ HELPERS ------------------ */

// Agrega puntos a los miles: 12345 → 12.345
const formatNumberWithDots = (nStr: string) => {
  const onlyDigits = nStr.replace(/\D/g, "");
  if (!onlyDigits) return "";
  return onlyDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Elimina puntos y convierte a número
const parseNumberFromFormatted = (s: string) => {
  const digits = (s || "").toString().replace(/\D/g, "");
  return digits === "" ? 0 : parseInt(digits, 10);
};

// Permitir http/https o rutas locales /img/...
const isValidURL = (s: string) => {
  if (!s) return false;

  // Rutas internas permitidas ej: "/img/mouse1.jpg"
  if (s.startsWith("/img/")) return true;

  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

/* ------------------ COMPONENTE ------------------ */

export const ProductoModal: React.FC<Props> = ({ visible, initial, onClose, onSave }) => {
  const [nombre, setNombre] = useState("");
  const [precioStr, setPrecioStr] = useState("");
  const [stockStr, setStockStr] = useState("");
  const [categoria, setCategoria] = useState("Periféricos");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ---------- Inicializar valores al abrir ---------- */
  useEffect(() => {
    if (visible && initial) {
      setNombre(initial.nombre ?? "");
      setPrecioStr(initial.precio > 0 ? formatNumberWithDots(String(initial.precio)) : "");
      setStockStr(initial.stock !== undefined ? String(initial.stock) : "");
      setCategoria(initial.categoria ?? "Periféricos");
      setDescripcion(initial.descripcion ?? "");
      setImagen(initial.imagen ?? "");
      setErrors({});
    }

    if (visible && !initial) {
      setNombre("");
      setPrecioStr("");
      setStockStr("");
      setCategoria("Periféricos");
      setDescripcion("");
      setImagen("");
      setErrors({});
    }
  }, [visible, initial]);

  /* ---------- Mostrar modal Bootstrap ---------- */
  useEffect(() => {
    if (visible) {
      const el = document.getElementById("productoModal");
      if (el) {
        const modal = new (window as any).bootstrap.Modal(el);
        modal.show();
      }
    }
  }, [visible]);

  /* ---------- Handlers ---------- */

  const handlePrecioChange = (raw: string) => {
    const formatted = formatNumberWithDots(raw);
    setPrecioStr(formatted);
    setErrors(prev => ({ ...prev, precio: "" }));
  };

  const handleStockChange = (raw: string) => {
    const onlyDigits = raw.replace(/\D/g, "");
    setStockStr(onlyDigits);
    setErrors(prev => ({ ...prev, stock: "" }));
  };

  /* ---------- Validaciones ---------- */
  const validateAll = (): boolean => {
    const e: Record<string, string> = {};

    if (!nombre || nombre.trim().length < 2) e.nombre = "Nombre obligatorio (mínimo 2 caracteres).";

    const precioNum = parseNumberFromFormatted(precioStr);
    if (!precioStr || precioNum <= 0) e.precio = "Precio obligatorio y mayor a 0.";

    const stockNum = stockStr === "" ? undefined : parseInt(stockStr, 10);
    if (stockNum === undefined || isNaN(stockNum) || stockNum < 0)
      e.stock = "Stock obligatorio (0 o más).";

    if (!categoria) e.categoria = "Categoría obligatoria.";

    if (!descripcion || descripcion.trim().length < 5)
      e.descripcion = "Descripción mínima 5 caracteres.";

    if (!imagen || !isValidURL(imagen))
      e.imagen = "Imagen inválida (http/https o ruta interna /img/...).";

    setErrors(e);

    if (Object.keys(e).length > 0) {
      Swal.fire("Error", e[Object.keys(e)[0]], "error");
      return false;
    }

    return true;
  };

  /* ---------- Guardar ---------- */

  const handleSave = async () => {
    if (!validateAll()) return;

    const payload: Omit<IProducto, "id"> = {
      nombre: nombre.trim(),
      precio: parseNumberFromFormatted(precioStr),
      categoria,
      descripcion: descripcion.trim(),
      imagen: imagen.trim(),
      stock: parseInt(stockStr || "0", 10)
    };

    try {
      const ok = await onSave(payload);
      if (ok) {
        const el = document.getElementById("productoModal");
        const modal = (window as any).bootstrap.Modal.getInstance(el);
        if (modal) modal.hide();

        /* --- Arreglar backdrop congelado --- */
        setTimeout(() => {
          document.body.classList.remove("modal-open");
          const backs = document.querySelectorAll(".modal-backdrop");
          backs.forEach(b => b.remove());
        }, 200);

      } else {
        Swal.fire("Error", "No se pudo guardar el producto.", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Error de conexión al guardar.", "error");
    }
  };

  if (!visible) return null;

  /* ---------- UI ---------- */

  return (
    <div id="productoModal" className="modal fade" tabIndex={-1} aria-hidden={!visible}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content modal-neon-admin bg-dark text-white">
          
          <div className="modal-header border-secondary">
            <h5 className="modal-title">
              {initial ? "Editar Producto" : "Nuevo Producto"}
            </h5>
            <button type="button" className="btn-close btn-close-white"
              data-bs-dismiss="modal" aria-label="Close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <form>

              {/* Nombre */}
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
                {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
              </div>

              {/* Precio + Stock */}
              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label">Precio</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className={`form-control ${errors.precio ? "is-invalid" : ""}`}
                    value={precioStr}
                    onChange={(e) => handlePrecioChange(e.target.value)}
                    placeholder="Ej: 1.000"
                  />
                  {errors.precio && <div className="invalid-feedback">{errors.precio}</div>}
                </div>

                <div className="col-6 mb-3">
                  <label className="form-label">Stock</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className={`form-control ${errors.stock ? "is-invalid" : ""}`}
                    value={stockStr}
                    onChange={(e) => handleStockChange(e.target.value)}
                    placeholder="0"
                  />
                  {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
                </div>
              </div>

              {/* Categoría */}
              <div className="mb-3">
                <label className="form-label">Categoría</label>
                <select
                  className={`form-select ${errors.categoria ? "is-invalid" : ""}`}
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  <option value="Periféricos">Periféricos</option>
                  <option value="Componentes">Componentes</option>
                  <option value="Audio">Audio</option>
                  <option value="Sillas">Sillas</option>
                  <option value="Monitores">Monitores</option>
                </select>
                {errors.categoria && <div className="invalid-feedback">{errors.categoria}</div>}
              </div>

              {/* Imagen */}
              <div className="mb-3">
                <label className="form-label">URL Imagen</label>
                <input
                  className={`form-control ${errors.imagen ? "is-invalid" : ""}`}
                  value={imagen}
                  onChange={(e) => setImagen(e.target.value)}
                  placeholder="https://... o /img/mouse1.jpg"
                />
                {errors.imagen && <div className="invalid-feedback">{errors.imagen}</div>}
              </div>

              {/* Descripción */}
              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                  className={`form-control ${errors.descripcion ? "is-invalid" : ""}`}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={3}
                />
                {errors.descripcion && <div className="invalid-feedback">{errors.descripcion}</div>}
              </div>

            </form>
          </div>

          <div className="modal-footer border-secondary">
            <button className="btn btn-secondary" data-bs-dismiss="modal" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn btn-gamer" onClick={handleSave}>
              Guardar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
