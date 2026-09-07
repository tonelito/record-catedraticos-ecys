import "./StatusPopover.css";

const STATUSES = [
  { value: "aprobado", label: "Aprobado" },
  { value: "cursando", label: "Cursando" },
  { value: "pendiente", label: "Pendiente" },
];

// Menú de tres opciones que se abre debajo de un tile. Es presentacional: no
// abre ni cierra nada por su cuenta ni habla con el backend. Quien lo usa
// decide cuándo mostrarlo (y por eso también maneja el clic fuera y Escape:
// un solo listener para toda la malla en vez de uno por cada uno de los 75
// cursos).
function StatusPopover({ status, onSelect, disabled = false }) {
  return (
    <div className="status-popover">
      <p className="status-popover-title">Estado del curso</p>

      {STATUSES.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`status-popover-option ${
            option.value === status ? "status-popover-option--current" : ""
          }`}
          onClick={() => onSelect(option.value)}
          disabled={disabled}
        >
          <span
            className="status-popover-dot"
            style={{ background: `var(--status-${option.value}-dot)` }}
          />
          <span className="status-popover-label">{option.label}</span>
          {option.value === status && <span className="status-popover-check">✓</span>}
        </button>
      ))}
    </div>
  );
}

export default StatusPopover;
