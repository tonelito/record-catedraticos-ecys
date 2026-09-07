import { useEffect } from "react";
import { X } from "lucide-react";
import "./Modal.css";

// Diálogo centrado sobre una capa oscura. Genérico: recibe título, subtítulo y
// contenido, y avisa por onClose. No sabe qué se está editando.
function Modal({ title, subtitle, onClose, children }) {
  // Escape cierra, y mientras el modal está abierto se bloquea el scroll del
  // fondo para que la página de atrás no se mueva bajo el diálogo.
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    // El clic en la capa oscura cierra; el clic dentro del diálogo no, porque
    // se detiene ahí y nunca llega a burbujear hasta la capa.
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="modal-header">
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X size={16} strokeWidth={2.4} />
          </button>
        </header>

        {children}
      </div>
    </div>
  );
}

export default Modal;
