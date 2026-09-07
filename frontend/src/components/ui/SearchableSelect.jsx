import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import "./SearchableSelect.css";

// "Organización" y "organizacion" deben coincidir: se quitan tildes y mayúsculas
// antes de comparar.
function normalize(text) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

// Dropdown con búsqueda escrita. Dos variantes visuales sobre la misma lógica:
//   - "pill":  la píldora compacta de la barra de filtros del dashboard.
//   - "field": el campo alto de 44px de los formularios.
// La opción cuyo value es null (si existe) se fija arriba del listado y no se
// filtra al escribir: es la de "quitar la selección".
function SearchableSelect({
  label,
  value,
  options,
  onChange,
  variant = "pill",
  placeholder = "Seleccioná una opción",
  highlight = false,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Cerrar el menú al hacer clic fuera o al presionar Escape.
  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event) {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // Al abrir, el cursor ya queda en el campo de búsqueda: se puede escribir
  // sin tener que hacer un clic extra.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const selected = options.find((option) => option.value === value);

  const resetOption = options.find((option) => option.value === null);
  const selectableOptions = options.filter((option) => option.value !== null);
  const matches = query
    ? selectableOptions.filter((option) =>
        normalize(option.label).includes(normalize(query)),
      )
    : selectableOptions;

  function toggle() {
    setQuery("");
    setOpen((previous) => !previous);
  }

  function select(optionValue) {
    onChange(optionValue);
    setQuery("");
    setOpen(false);
  }

  function handleSearchKeyDown(event) {
    // Enter elige la primera coincidencia, sin tener que soltar el teclado.
    if (event.key === "Enter" && matches.length > 0) {
      event.preventDefault();
      select(matches[0].value);
    }
  }

  const isPill = variant === "pill";
  const triggerClasses = [
    "searchable-select-trigger",
    `searchable-select-trigger--${variant}`,
    isPill && value !== null ? "searchable-select-trigger--active" : "",
    highlight ? "searchable-select-trigger--highlight" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`searchable-select searchable-select--${variant}`} ref={containerRef}>
      <button type="button" className={triggerClasses} onClick={toggle} aria-expanded={open}>
        {isPill ? (
          <span>
            {label}: {selected?.label ?? "todos"}
          </span>
        ) : (
          <span className={selected ? "" : "searchable-select-placeholder"}>
            {selected?.label ?? placeholder}
          </span>
        )}
        <ChevronDown size={isPill ? 12 : 16} strokeWidth={2.6} />
      </button>

      {open && (
        <div className="searchable-select-menu">
          <input
            ref={inputRef}
            type="text"
            className="searchable-select-search"
            placeholder="Escribí para filtrar…"
            aria-label={`Buscar ${label.toLowerCase()}`}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleSearchKeyDown}
          />

          <ul className="searchable-select-options">
            {resetOption && (
              <li>
                <button
                  type="button"
                  className={value === null ? "is-selected" : ""}
                  onClick={() => select(null)}
                >
                  {resetOption.label}
                </button>
              </li>
            )}

            {matches.map((option) => (
              <li key={String(option.value)}>
                <button
                  type="button"
                  className={option.value === value ? "is-selected" : ""}
                  onClick={() => select(option.value)}
                >
                  {option.label}
                </button>
              </li>
            ))}

            {matches.length === 0 && (
              <li className="searchable-select-empty">Sin coincidencias</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchableSelect;
